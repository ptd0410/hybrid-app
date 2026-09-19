import type { Dirent, Stats } from "node:fs";
import type { FileType } from "./fs.type";
import { isRootPath, isSameFsPath, isTrashPath, normalizeFsPath } from "./fs.paths";

const volumePaths = new Set<string>();

export function setVolumePaths(paths: Iterable<string>) {
  volumePaths.clear();
  for (const item of paths) {
    const normalized = normalizeFsPath(item);
    if (!isRootPath(normalized) && !isTrashPath(normalized)) {
      volumePaths.add(normalized);
    }
  }
}

export function isVolumePath(targetPath: string) {
  const normalized = normalizeFsPath(targetPath);
  for (const volume of volumePaths) {
    if (isSameFsPath(volume, normalized)) return true;
  }
  return false;
}

export function classifyFileType(
  targetPath: string,
  entry: Pick<
    Dirent | Stats,
    "isSymbolicLink" | "isDirectory" | "isFile"
  >,
): FileType {
  if (isTrashPath(targetPath)) return "trash";
  if (isRootPath(targetPath)) return "root";
  if (isVolumePath(targetPath)) return "volume";
  if (entry.isSymbolicLink()) return "symlink";
  if (entry.isDirectory()) return "folder";
  if (entry.isFile()) return "file";
  return "unknown";
}
