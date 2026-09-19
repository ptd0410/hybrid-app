import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import type { Dirent, Stats } from "node:fs";
import { classifyFileType, setVolumePaths } from "./fs.classify";
import { withFsError } from "./fs.error";
import { fsOperations, runFsOperation } from "./fs.operation";
import type {
  DeleteOptions,
  FileEntry,
  FilePermissions,
  FileStat,
  FileType,
  FsApi,
  FsPage,
  FsPagination,
} from "./fs.type";
import { isFsContainer } from "./fs.type";
import { getLinuxVolumes, getMacVolumes, getWindowsVolumes } from "./service";

function toFileType(targetPath: string, entry: Dirent | Stats): FileType {
  return classifyFileType(targetPath, entry);
}

function toPermissions(mode: number): FilePermissions {
  return {
    readable: (mode & 0o400) !== 0,
    writable: (mode & 0o200) !== 0,
    executable: (mode & 0o100) !== 0,
  };
}

function isHidden(filePath: string): boolean {
  return path.basename(filePath).startsWith(".");
}

async function toFileStat(filePath: string): Promise<FileStat> {
  const stats = await fs.lstat(filePath);
  const permissions = toPermissions(stats.mode);

  return {
    path: filePath,
    type: toFileType(filePath, stats),
    size: stats.size,
    createdAt: stats.birthtimeMs,
    modifiedAt: stats.mtimeMs,
    accessedAt: stats.atimeMs,
    permissions,
    hidden: isHidden(filePath),
    readonly: !permissions.writable,
  };
}

async function canListDir(dirPath: string) {
  try {
    const dir = await fs.opendir(dirPath);
    await dir.close();
    return true;
  } catch {
    return false;
  }
}

async function listVolumes() {
  switch (os.platform()) {
    case "win32":
      return getWindowsVolumes();
    case "darwin":
      return getMacVolumes();
    default:
      return getLinuxVolumes();
  }
}

let volumePathsReady = false;

async function ensureVolumePaths() {
  if (volumePathsReady) return;
  const volumes = await listVolumes();
  setVolumePaths(volumes.map((volume) => volume.path));
  volumePathsReady = true;
}

export async function requestProtectedFolderAccess() {
  if (os.platform() !== "darwin") return;

  const home = os.homedir();
  for (const name of ["Desktop", "Documents", "Downloads"]) {
    await canListDir(path.join(home, name));
  }
}

export const fsApi: FsApi = {
  async readDir(
    dirPath: string,
    pagination?: Partial<FsPagination>,
  ): Promise<FsPage<FileEntry>> {
    return withFsError(dirPath, async () => {
      await ensureVolumePaths();
      const dirents = await fs.readdir(dirPath, { withFileTypes: true });
      const entries: FileEntry[] = await Promise.all(
        dirents.map(async (entry) => {
          const filePath = path.join(dirPath, entry.name);
          const item: FileEntry = {
            name: entry.name,
            path: filePath,
            type: toFileType(filePath, entry),
          };
          try {
            const stats = await fs.lstat(filePath);
            item.type = toFileType(filePath, stats);
            item.size = stats.size;
            item.modifiedAt = stats.mtimeMs;
            item.createdAt = stats.birthtimeMs;
          } catch {
            // keep listing even if a single entry cannot be statted
          }
          return item;
        }),
      );

      entries.sort((a, b) => {
        const aContainer = isFsContainer(a.type);
        const bContainer = isFsContainer(b.type);
        if (aContainer && !bContainer) return -1;
        if (!aContainer && bContainer) return 1;
        return a.name.localeCompare(b.name);
      });

      const total = entries.length;
      const pageSize = Math.max(1, pagination?.pageSize ?? (total || 1));
      const lastPage = Math.max(1, Math.ceil(total / pageSize));
      const page = Math.min(Math.max(1, pagination?.page ?? 1), lastPage);
      const start = (page - 1) * pageSize;
      const items = entries.slice(start, start + pageSize);

      return {
        items,
        total,
        page,
        pageSize,
        hasMore: page < lastPage,
      };
    });
  },

  async stat(filePath: string): Promise<FileStat> {
    return withFsError(filePath, async () => {
      await ensureVolumePaths();
      return toFileStat(filePath);
    });
  },

  async createFile(filePath: string): Promise<void> {
    await runFsOperation("createFile", [filePath], async (signal) => {
      signal.throwIfAborted();
      await fs.writeFile(filePath, new Uint8Array(), { flag: "wx" });
    });
  },

  async createDir(dirPath: string): Promise<void> {
    await runFsOperation("createDir", [dirPath], async (signal) => {
      signal.throwIfAborted();
      await fs.mkdir(dirPath);
    });
  },

  async readFile(filePath: string): Promise<Uint8Array> {
    return runFsOperation("readFile", [filePath], async (signal) => {
      const buffer = await fs.readFile(filePath, { signal });
      return new Uint8Array(buffer);
    });
  },

  async writeFile(filePath: string, data: Uint8Array): Promise<void> {
    await runFsOperation("writeFile", [filePath], async (signal) => {
      await fs.writeFile(filePath, data, { signal });
    });
  },

  async delete(filePath: string, options?: DeleteOptions): Promise<void> {
    await runFsOperation("delete", [filePath], async (signal) => {
      await fs.rm(filePath, {
        recursive: options?.recursive ?? false,
        force: options?.force ?? false,
        signal,
      });
    });
  },

  async copy(src: string, dest: string): Promise<void> {
    await runFsOperation("copy", [src, dest], async (signal) => {
      await fs.cp(src, dest, { recursive: true, signal });
    });
  },

  async move(src: string, dest: string): Promise<void> {
    await runFsOperation("move", [src, dest], async (signal) => {
      try {
        signal.throwIfAborted();
        await fs.rename(src, dest);
      } catch (error) {
        const code = (error as NodeJS.ErrnoException).code;
        if (code !== "EXDEV") throw error;
        await fs.cp(src, dest, { recursive: true, signal });
        await fs.rm(src, { recursive: true, force: true, signal });
      }
    });
  },

  async rename(filePath: string, newName: string): Promise<void> {
    const dest = path.join(path.dirname(filePath), newName);
    await runFsOperation("rename", [filePath, dest], async (signal) => {
      signal.throwIfAborted();
      await fs.rename(filePath, dest);
    });
  },

  async listOperations() {
    return fsOperations.list();
  },

  async getOperation(id: string) {
    return fsOperations.get(id);
  },

  async cancelOperation(id: string) {
    return fsOperations.cancel(id);
  },

  async volumes() {
    const volumes = await withFsError("/", listVolumes);
    setVolumePaths(volumes.map((volume) => volume.path));
    volumePathsReady = true;
    return volumes;
  },

  async favorites(): Promise<FileEntry[]> {
    const home = os.homedir();
    const favorites = [
      { name: "Desktop", path: path.join(home, "Desktop") },
      { name: "Documents", path: path.join(home, "Documents") },
      { name: "Downloads", path: path.join(home, "Downloads") },
    ];

    const entries: FileEntry[] = [];

    for (const item of favorites) {
      if (await canListDir(item.path)) {
        entries.push({
          name: item.name,
          path: item.path,
          type: "folder",
        });
      }
    }

    if (!entries.length) {
      entries.push({
        name: "Home",
        path: home,
        type: "folder",
      });
    }

    return entries;
  },
};
