import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import type { FsApi, FsEntry, FsVolume } from "types";

import { getLinuxVolumes, getMacVolumes, getWindowsVolumes } from "./service";

export const fsApi: FsApi = {
  async readDir(dirPath: string): Promise<FsEntry[]> {
    const entries = await fs.readdir(dirPath, {
      withFileTypes: true,
    });

    return entries.map((entry) => ({
      name: entry.name,
      path: path.join(dirPath, entry.name),
      type: entry.isDirectory() ? "directory" : "file",
    }));
  },

  async volumes(): Promise<FsVolume[]> {
    switch (os.platform()) {
      case "win32":
        return getWindowsVolumes();

      case "darwin":
        return getMacVolumes();

      default:
        return getLinuxVolumes();
    }
  },

  async favorites(): Promise<FsEntry[]> {
    const base = ["Desktop", "Documents", "Downloads"];
    const baseDirs = base.map((dir) => path.join(os.homedir(), dir));

    const dirs = (await fsApi.readDir(os.homedir())).filter((dir) =>
      baseDirs.includes(dir.path),
    );

    return dirs;
  },
};
