import fs from "node:fs";
import path from "node:path";

import { download } from "./download";
import { install, remove } from "./install";
import { appsRepository } from "./app.repository";
import { appApi } from "./app.api";

function compareVersions(a: string, b: string): number {
  const left = a.split(".").map(Number);
  const right = b.split(".").map(Number);
  const length = Math.max(left.length, right.length);

  for (let i = 0; i < length; i++) {
    const leftPart = left[i] ?? 0;
    const rightPart = right[i] ?? 0;

    if (leftPart > rightPart) {
      return 1;
    }

    if (leftPart < rightPart) {
      return -1;
    }
  }

  return 0;
}

export async function resolve(appId: string): Promise<string> {
  const metadata = await appApi.fetchAppMetadata(appId);

  if (!metadata) {
    throw new Error(`App not found: ${appId}`);
  }

  const cachedApp = appsRepository.getById(appId);
  const cachedPath = cachedApp?.path;
  const hasCachedInstall = Boolean(cachedPath && fs.existsSync(cachedPath));

  const cachedVersion = cachedApp?.version ?? "0.0.0";
  const isRemoteNewer = compareVersions(metadata.version, cachedVersion) > 0;

  if (hasCachedInstall && cachedPath && !isRemoteNewer) {
    return cachedPath;
  }

  const zipFileName = path.basename(new URL(metadata.zipUrl).pathname);
  const zipPath = await download(metadata.zipUrl, zipFileName);

  const installedPath = install({
    appId: metadata.id,
    version: metadata.version,
    zipPath,
  });

  const now = new Date();

  if (cachedApp) {
    appsRepository.update(appId, {
      name: metadata.name,
      version: metadata.version,
      path: installedPath,
      updatedAt: now,
    });
  } else {
    appsRepository.create({
      id: metadata.id,
      name: metadata.name,
      version: metadata.version,
      path: installedPath,
      createdAt: now,
      updatedAt: now,
    });
  }

  if (hasCachedInstall && cachedPath && cachedPath !== installedPath) {
    remove(cachedPath);
  }

  return installedPath;
}
