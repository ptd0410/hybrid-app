import { isFsContainer, type FileEntry } from "@/api/fs";
import { canMoveInto } from "@/lib";
import { useActiveStore } from "@/modules/active";
import { useFsStore } from "@/modules/fs";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type DragEventHandler,
} from "react";
import { fileActions } from "./file-action.hook";
import { useFavorites } from "./fs.hook";

export const fileDropOverClass =
  "bg-blue-500/40 outline outline-1 outline-blue-300/80 outline-offset-[-1px]";

type DropHandlers = {
  onDragEnter: DragEventHandler;
  onDragOver: DragEventHandler;
  onDragLeave: DragEventHandler;
  onDrop: DragEventHandler;
};

function useDropState() {
  const [over, setOver] = useState(false);
  const depth = useRef(0);

  const reset = useCallback(() => {
    depth.current = 0;
    setOver(false);
  }, []);

  return { over, setOver, depth, reset };
}

function useResetDrop(dragging: FileEntry | null, reset: () => void) {
  useEffect(() => {
    if (!dragging) reset();
  }, [dragging, reset]);
}

export function useFileDrag(entry: FileEntry) {
  const dragging = useFsStore((s) => s.dragging);
  const isDragging = dragging?.path === entry.path;

  const dragProps = {
    draggable: true as const,
    onDragStart: (event: DragEvent) => {
      event.stopPropagation();
      event.dataTransfer.setData("text/plain", entry.path);
      event.dataTransfer.effectAllowed = "copyMove";
      useFsStore.getState().setDragging(entry);
      if (!useActiveStore.getState().selected.includes(entry.path)) {
        useActiveStore.getState().setSelected([entry.path]);
      }
    },
    onDragEnd: () => {
      useFsStore.getState().setDragging(null);
      const block = (click: Event) => {
        click.preventDefault();
        click.stopPropagation();
        window.removeEventListener("click", block, true);
      };
      window.addEventListener("click", block, true);
      window.setTimeout(
        () => window.removeEventListener("click", block, true),
        80,
      );
    },
  };

  return { isDragging, dragProps };
}

export function useFolderDrop(destPath?: string) {
  const dragging = useFsStore((s) => s.dragging);
  const { over, setOver, depth, reset } = useDropState();
  useResetDrop(dragging, reset);
  const canDrop = Boolean(
    destPath && dragging && canMoveInto(dragging.path, destPath),
  );

  const dropProps: DropHandlers = {
    onDragEnter: (event) => {
      if (!canDrop) return;
      event.preventDefault();
      event.stopPropagation();
      depth.current += 1;
      setOver(true);
    },
    onDragOver: (event) => {
      if (!canDrop) return;
      event.preventDefault();
      event.stopPropagation();
      event.dataTransfer.dropEffect = "move";
    },
    onDragLeave: (event) => {
      if (!canDrop) return;
      event.stopPropagation();
      depth.current = Math.max(0, depth.current - 1);
      if (depth.current === 0) setOver(false);
    },
    onDrop: (event) => {
      const src = useFsStore.getState().dragging;
      if (!src || !destPath || !canMoveInto(src.path, destPath)) return;
      event.preventDefault();
      event.stopPropagation();
      reset();
      useFsStore.getState().setDragging(null);
      fileActions.moveInto(src.path, destPath);
    },
  };

  return { isOver: over && canDrop, dropProps };
}

export function useFavoriteDrop() {
  const dragging = useFsStore((s) => s.dragging);
  const { data } = useFavorites();
  const { over, setOver, depth, reset } = useDropState();
  useResetDrop(dragging, reset);
  const canDrop = Boolean(
    dragging &&
      isFsContainer(dragging.type) &&
      !(data ?? []).some((item) => item.path === dragging.path),
  );

  const dropProps: DropHandlers = {
    onDragEnter: (event) => {
      if (!canDrop) return;
      event.preventDefault();
      event.stopPropagation();
      depth.current += 1;
      setOver(true);
    },
    onDragOver: (event) => {
      if (!canDrop) return;
      event.preventDefault();
      event.stopPropagation();
      event.dataTransfer.dropEffect = "copy";
    },
    onDragLeave: (event) => {
      if (!canDrop) return;
      event.stopPropagation();
      depth.current = Math.max(0, depth.current - 1);
      if (depth.current === 0) setOver(false);
    },
    onDrop: (event) => {
      const src = useFsStore.getState().dragging;
      if (
        !src ||
        !isFsContainer(src.type) ||
        (data ?? []).some((item) => item.path === src.path)
      ) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      reset();
      useFsStore.getState().setDragging(null);
      fileActions.addFavorite(src);
    },
  };

  return { isOver: over && canDrop, dropProps };
}
