import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import type { FsEntry, FsVolume } from "./fs.types";
import { getLinuxVolumes, getMacVolumes, getWindowsVolumes } from "./service";

export const fsApi = {
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

  async getVolumes(): Promise<FsVolume[]> {
    switch (os.platform()) {
      case "win32":
        return getWindowsVolumes();

      case "darwin":
        return getMacVolumes();

      default:
        return getLinuxVolumes();
    }
  },
};
