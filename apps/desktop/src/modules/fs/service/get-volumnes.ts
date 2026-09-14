import fs from "node:fs/promises";
import path from "node:path";
import { FsVolume } from "../fs.types";

export async function getWindowsVolumes(): Promise<FsVolume[]> {
  const volumes: FsVolume[] = [];

  for (let code = 65; code <= 90; code++) {
    const drive = `${String.fromCharCode(code)}:\\`;

    try {
      await fs.access(drive);

      volumes.push({
        name: `${String.fromCharCode(code)}:`,
        path: drive,
      });
    } catch {
      // Drive không tồn tại hoặc không accessible.
    }
  }

  return volumes;
}

export async function getMacVolumes(): Promise<FsVolume[]> {
  const volumes: FsVolume[] = [
    {
      name: "Macintosh HD",
      path: "/",
    },
  ];

  try {
    const entries = await fs.readdir("/Volumes", {
      withFileTypes: true,
    });

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }

      volumes.push({
        name: entry.name,
        path: path.join("/Volumes", entry.name),
      });
    }
  } catch {
    // /Volumes không tồn tại hoặc không accessible.
  }

  return volumes;
}

export async function getLinuxVolumes(): Promise<FsVolume[]> {
  const volumes: FsVolume[] = [
    {
      name: "/",
      path: "/",
    },
  ];

  const mountPoints = ["/mnt", "/media"];

  for (const mountPoint of mountPoints) {
    try {
      const entries = await fs.readdir(mountPoint, {
        withFileTypes: true,
      });

      for (const entry of entries) {
        if (!entry.isDirectory()) {
          continue;
        }

        volumes.push({
          name: entry.name,
          path: path.join(mountPoint, entry.name),
        });
      }
    } catch {
      // Mount point không tồn tại hoặc không accessible.
    }
  }

  return volumes;
}
