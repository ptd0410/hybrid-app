import { isFsContainer, type FileEntry } from "@/api/fs";
import { Desc, Tag, Text } from "@/components/ui";
import {
  fileDropOverClass,
  useDirItems,
  useFileVirtualizer,
  useFolderDrop,
} from "@/hooks";
import { cn, moveIndex, nextSelection } from "@/lib";
import { useActiveStore } from "@/modules/active";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { FileContextMenu } from "./FileContextMenu";
import { kindLabel, typeIcon, virtualSize } from "./file.const";
import { FilePager, FileStatus } from "./FileStatus";
import { VirtualSpace, virtualItemStyle } from "./virtual.ui";

export function ColumnView() {
  const root = useActiveStore((s) => s.root);
  const selected = useActiveStore((s) => s.selected);
  const setSelected = useActiveStore((s) => s.setSelected);
  const [trail, setTrail] = useState<FileEntry[]>([]);
  const itemsByColumn = useRef<Map<number, FileEntry[]>>(new Map());
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTrail([]);
    itemsByColumn.current.clear();
  }, [root]);

  const dirs: string[] = [root];
  let preview: FileEntry | undefined;
  for (const entry of trail) {
    if (isFsContainer(entry.type)) dirs.push(entry.path);
    else {
      preview = entry;
      break;
    }
  }
  const trailSelected = trail
    .map((entry) => entry.path)
    .filter((path) => !selected.includes(path));

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const last = scroller.lastElementChild;
    if (!(last instanceof HTMLElement)) return;
    const parentRect = scroller.getBoundingClientRect();
    const lastRect = last.getBoundingClientRect();
    if (lastRect.right > parentRect.right + 1) {
      scroller.scrollTo({ left: scroller.scrollWidth, behavior: "smooth" });
    }
  }, [dirs.length, preview]);

  function handleSelect(
    columnIndex: number,
    items: FileEntry[],
    entry: FileEntry,
    event: MouseEvent,
  ) {
    setTrail((prev) => [...prev.slice(0, columnIndex), entry]);
    setSelected(nextSelection(items, selected, entry.path, event));
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const meta = event.metaKey || event.ctrlKey;
      const activeIndex = Math.max(0, trail.length - 1);
      const items = itemsByColumn.current.get(activeIndex) ?? [];

      if (meta) {
        if (event.key.toLowerCase() === "a") {
          event.preventDefault();
          setSelected(items.map((item) => item.path));
        }
        return;
      }

      if (event.key === "ArrowLeft") {
        if (activeIndex <= 0) return;
        event.preventDefault();
        const nextTrail = trail.slice(0, activeIndex);
        setTrail(nextTrail);
        const parent = nextTrail.at(-1);
        setSelected(parent ? [parent.path] : []);
        return;
      }

      if (event.key === "ArrowRight") {
        const current =
          items.find((item) => item.path === selected.at(-1)) ?? trail.at(-1);
        if (!current || !isFsContainer(current.type)) return;
        const nextItems = itemsByColumn.current.get(activeIndex + 1) ?? [];
        const first = nextItems[0];
        if (!first) return;
        event.preventDefault();
        setTrail([...trail.slice(0, activeIndex + 1), first]);
        setSelected([first.path]);
        return;
      }

      const nextIndex = moveIndex(
        event.key,
        items.findIndex((item) => item.path === selected.at(-1)),
        items.length,
      );
      if (nextIndex == null) return;
      const next = items[nextIndex];
      if (!next) return;
      event.preventDefault();
      setTrail([...trail.slice(0, activeIndex), next]);
      setSelected([next.path]);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected, setSelected, trail]);

  return (
    <div
      ref={scrollerRef}
      className="flex-1 w-full min-h-0 flex overflow-x-auto select-none"
    >
      {dirs.map((path, index) => (
        <ColumnPane
          key={`${index}:${path}`}
          path={path}
          selected={selected}
          trailSelected={trailSelected}
          onItems={(items) => itemsByColumn.current.set(index, items)}
          onSelect={(items, entry, event) =>
            handleSelect(index, items, entry, event)
          }
          onClear={() => {
            setTrail((prev) => prev.slice(0, index));
            const parent = trail[index - 1];
            setSelected(parent ? [parent.path] : []);
          }}
        />
      ))}
      {preview && (
        <div className="w-56 shrink-0 flex flex-col items-center justify-center gap-3 p-4 border-l border-white/10">
          <Tag
            name={typeIcon[preview.type]}
            size={56}
            className="text-white/80"
          />
          <Text className="text-center break-all">{preview.name}</Text>
          <Desc className="text-white/45">{kindLabel[preview.type]}</Desc>
        </div>
      )}
    </div>
  );
}

function ColumnPane({
  path,
  selected,
  trailSelected,
  onItems,
  onSelect,
  onClear,
}: {
  path: string;
  selected: string[];
  trailSelected: string[];
  onItems: (items: FileEntry[]) => void;
  onSelect: (
    items: FileEntry[],
    entry: FileEntry,
    event: MouseEvent,
  ) => void;
  onClear: () => void;
}) {
  const {
    items,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useDirItems(path);
  const { isOver, dropProps } = useFolderDrop(path);
  const listRef = useRef<HTMLDivElement>(null);

  onItems(items);

  const localPath =
    items.find((item) => selected.includes(item.path))?.path ??
    items.find((item) => trailSelected.includes(item.path))?.path;
  const selectedIndex = items.findIndex((item) => item.path === localPath);
  const virtualizer = useFileVirtualizer({
    parentRef: listRef,
    count: items.length,
    estimateSize: virtualSize.listRow,
    selectedIndex,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    getItemKey: (index) => items[index]?.path ?? index,
  });

  return (
    <div
      ref={listRef}
      className={cn(
        "w-52 shrink-0 min-h-0 overflow-y-auto border-r border-white/10",
        isOver && fileDropOverClass,
      )}
      onClick={onClear}
      {...dropProps}
    >
      <FileStatus
        isLoading={isLoading}
        error={error}
        empty={!isLoading && items.length === 0}
      />
      <VirtualSpace size={virtualizer.getTotalSize()}>
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const entry = items[virtualItem.index];
          if (!entry) return null;
          const isSelected = selected.includes(entry.path);
          const isTrail = trailSelected.includes(entry.path);
          return (
            <FileContextMenu
              key={virtualItem.key}
              entry={entry}
              data-index={virtualItem.index}
              data-path={entry.path}
              ref={virtualizer.measureElement}
              className={cn(
                "flex items-center gap-2 px-3 py-1 text-left",
                isSelected && "bg-blue-500/35",
                !isSelected && isTrail && "bg-white/15",
                !isSelected && !isTrail && "hover:bg-white/10",
              )}
              style={virtualItemStyle(virtualItem.start)}
              onClick={(event) => {
                event.stopPropagation();
                onSelect(items, entry, event);
              }}
            >
              <Tag name={typeIcon[entry.type]} className="shrink-0" />
              <Text className="flex-1 truncate">{entry.name}</Text>
              {isFsContainer(entry.type) && (
                <Tag
                  name="ChevronRight"
                  size={14}
                  className="shrink-0 text-white/35"
                />
              )}
            </FileContextMenu>
          );
        })}
      </VirtualSpace>
      <FilePager isFetchingNextPage={isFetchingNextPage} />
    </div>
  );
}
