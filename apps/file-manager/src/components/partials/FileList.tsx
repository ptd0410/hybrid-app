import { useEnsureRoot, useFileActionHotkeys } from "@/hooks";
import { useActiveStore } from "@/modules/active";
import {
  ColumnView,
  FileDialogs,
  GalleryView,
  IconView,
  ListView,
  SpaceContextMenu,
} from "./files";

export type FileListProps = {};

export function FileList({}: FileListProps) {
  useEnsureRoot();
  useFileActionHotkeys();
  const display = useActiveStore((s) => s.display);

  return (
    <>
      <SpaceContextMenu>
        {display === "icon" ? (
          <IconView />
        ) : display === "column" ? (
          <ColumnView />
        ) : display === "gallery" ? (
          <GalleryView />
        ) : (
          <ListView />
        )}
      </SpaceContextMenu>
      <FileDialogs />
    </>
  );
}
