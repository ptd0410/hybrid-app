import { isFsContainer, type FileEntry } from "@/api/fs";
import { basename, nextSelection, selectedEntry } from "@/lib";
import { useActiveStore } from "@/modules/active";
import { fsQuery } from "@/modules/fs";
import { useQuery } from "@tanstack/react-query";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  type MouseEvent,
  type RefObject,
} from "react";
import { useClickRoot } from "./a.hook";
import { useDirItems } from "./fs.hook";

export function useGridColumns(
  ref: RefObject<HTMLElement | null>,
  itemWidth = 100,
) {
  const [columns, setColumns] = useState(1);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const styles = getComputedStyle(el);
      const padding =
        Number.parseFloat(styles.paddingLeft) +
        Number.parseFloat(styles.paddingRight);
      const gap = Number.parseFloat(styles.columnGap || styles.gap) || 4;
      const width = el.clientWidth - padding;
      setColumns(Math.max(1, Math.floor((width + gap) / (itemWidth + gap))));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [itemWidth, ref]);

  return columns;
}

export function useFileHotkeys(options: {
  items: FileEntry[];
  selected: string[];
  setSelected: (paths: string[]) => void;
  onOpen: (entry: FileEntry) => void;
  getNextIndex: (key: string, index: number) => number | undefined;
}) {
  const { items, selected, setSelected, onOpen, getNextIndex } = options;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const meta = event.metaKey || event.ctrlKey;
      if (meta) {
        if (event.key.toLowerCase() === "a") {
          event.preventDefault();
          setSelected(items.map((item) => item.path));
        }
        return;
      }

      if (event.key === "Enter") {
        const current = items.find((item) => item.path === selected.at(-1));
        if (!current) return;
        event.preventDefault();
        onOpen(current);
        return;
      }

      if (!items.length) return;
      const index = items.findIndex((item) => item.path === selected.at(-1));
      const nextIndex = getNextIndex(event.key, index);
      if (nextIndex == null) return;
      const next = items[nextIndex];
      if (!next) return;
      event.preventDefault();
      setSelected([next.path]);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [getNextIndex, items, onOpen, selected, setSelected]);
}

export function useBrowserDir() {
  const root = useActiveStore((s) => s.root);
  const selected = useActiveStore((s) => s.selected);
  const setSelected = useActiveStore((s) => s.setSelected);
  const goTo = useClickRoot();
  const listing = useDirItems(root);

  const handleSelect = useCallback(
    (entry: FileEntry, event: MouseEvent) => {
      setSelected(nextSelection(listing.items, selected, entry.path, event));
    },
    [listing.items, selected, setSelected],
  );

  const handleOpen = useCallback(
    (entry: FileEntry) => {
      if (isFsContainer(entry.type)) goTo(entry.path);
    },
    [goTo],
  );

  return {
    ...listing,
    root,
    selected,
    setSelected,
    goTo,
    handleSelect,
    handleOpen,
  };
}

export function useActiveTarget() {
  const root = useActiveStore((s) => s.root);
  const selected = useActiveStore((s) => s.selected);
  const { items } = useDirItems(root);
  const path = selected.at(-1);
  const fromList = selectedEntry(items, selected);
  const { data: stat } = useQuery({
    ...fsQuery.stat(path ?? ""),
    enabled: Boolean(path) && !fromList,
  });

  const isCurrentFolder = selected.length === 0;
  const multi = selected.length > 1;
  const entry: FileEntry | undefined = isCurrentFolder
    ? root
      ? { name: basename(root), path: root, type: "folder" }
      : undefined
    : (fromList ??
      (stat
        ? { name: basename(stat.path), path: stat.path, type: stat.type }
        : path
          ? { name: basename(path), path, type: "file" }
          : undefined));

  return { entry, isCurrentFolder, multi, root };
}
