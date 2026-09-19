import type { FileEntry, FileType } from "@/api/fs";
import type { SortKey } from "@/modules/active";

const kindOrder: Record<FileType, number> = {
  root: 0,
  volume: 1,
  trash: 2,
  folder: 3,
  symlink: 4,
  file: 5,
  unknown: 6,
};

function compareName(a: string, b: string) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

export function sortEntries(items: FileEntry[], sortBy: SortKey) {
  return [...items].sort((a, b) => {
    let result = 0;
    switch (sortBy) {
      case "kind":
        result = kindOrder[a.type] - kindOrder[b.type];
        break;
      case "date":
        result = (b.modifiedAt ?? 0) - (a.modifiedAt ?? 0);
        break;
      case "created":
        result = (b.createdAt ?? 0) - (a.createdAt ?? 0);
        break;
      case "size":
        result = (b.size ?? 0) - (a.size ?? 0);
        break;
      case "tags":
        result = compareName(a.tags?.[0] ?? "", b.tags?.[0] ?? "");
        break;
      default:
        result = compareName(a.name, b.name);
    }
    return result || compareName(a.name, b.name);
  });
}

export function selectRange(items: FileEntry[], from: string, to: string) {
  const start = items.findIndex((item) => item.path === from);
  const end = items.findIndex((item) => item.path === to);
  if (start < 0 || end < 0) return [to];
  const [lo, hi] = start < end ? [start, end] : [end, start];
  return items.slice(lo, hi + 1).map((item) => item.path);
}

export function togglePath(selected: string[], path: string) {
  return selected.includes(path)
    ? selected.filter((item) => item !== path)
    : [...selected, path];
}

export function nextSelection(
  items: FileEntry[],
  selected: string[],
  path: string,
  event: { shiftKey: boolean; metaKey: boolean; ctrlKey: boolean },
) {
  if (event.shiftKey && selected[0]) {
    return selectRange(items, selected[0], path);
  }
  if (event.metaKey || event.ctrlKey) return togglePath(selected, path);
  return [path];
}

export function selectedEntry(items: FileEntry[], selected: string[]) {
  const path = selected.at(-1);
  return items.find((item) => item.path === path);
}

export function moveIndex(
  key: string,
  index: number,
  length: number,
  columns = 1,
) {
  if (!length) return undefined;
  if (index < 0) return 0;
  switch (key) {
    case "ArrowUp":
      return Math.max(0, index - columns);
    case "ArrowDown":
      return Math.min(length - 1, index + columns);
    case "ArrowLeft":
      return Math.max(0, index - 1);
    case "ArrowRight":
      return Math.min(length - 1, index + 1);
    default:
      return undefined;
  }
}
