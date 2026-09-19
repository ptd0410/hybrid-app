import type { FileType } from "@/api/fs";
import type { IconName } from "@/components/ui";
import type { DisplayMode, SortKey } from "@/modules/active";

export const DISPLAY_MODES: {
  id: DisplayMode;
  label: string;
  icon: IconName;
  shortcut: string;
}[] = [
  { id: "icon", label: "Icons", icon: "LayoutGrid", shortcut: "1" },
  { id: "list", label: "List", icon: "List", shortcut: "2" },
  { id: "column", label: "Columns", icon: "Columns3", shortcut: "3" },
  { id: "gallery", label: "Gallery", icon: "GalleryHorizontal", shortcut: "4" },
];

export const SORT_OPTIONS: {
  id: SortKey;
  label: string;
  icon: IconName;
}[] = [
  { id: "name", label: "Name", icon: "ALargeSmall" },
  { id: "kind", label: "Kind", icon: "Files" },
  { id: "date", label: "Date Modified", icon: "Clock" },
  { id: "created", label: "Date Created", icon: "CalendarPlus" },
  { id: "size", label: "Size", icon: "HardDrive" },
  { id: "tags", label: "Tags", icon: "Tags" },
];

export const typeIcon: Record<FileType, IconName> = {
  file: "File",
  folder: "Folder",
  symlink: "Link",
  volume: "HardDrive",
  root: "Monitor",
  trash: "Trash2",
  unknown: "FileQuestion",
};

export const kindLabel: Record<FileType, string> = {
  file: "File",
  folder: "Folder",
  symlink: "Alias",
  volume: "Volume",
  root: "Root",
  trash: "Trash",
  unknown: "Unknown",
};

export const virtualSize = {
  listRow: 28,
  iconMinWidth: 96,
  iconRow: 92,
  iconGap: 4,
  galleryItem: 80,
  galleryGap: 4,
} as const;
