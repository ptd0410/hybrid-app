import fs from "node:fs";
import path from "node:path";

import { createRequire } from "node:module";
import { getAppsDir } from "../../app.helper";

const require = createRequire(import.meta.url);
const AdmZip = require("adm-zip");

export interface InstallAppOptions {
  appId: string;
  version: string;
  zipPath: string;
}

const appsDir = getAppsDir("apps");

fs.mkdirSync(appsDir, {
  recursive: true,
});

export function install({
  appId,
  version,
  zipPath,
}: InstallAppOptions): string {
  if (!fs.existsSync(zipPath)) {
    throw new Error(`ZIP file not found: ${zipPath}`);
  }

  const installDir = path.join(appsDir, appId, version);

  fs.mkdirSync(installDir, {
    recursive: true,
  });

  const zip = new AdmZip(zipPath);

  zip.extractAllTo(installDir, true);

  return path.join(installDir, "dist");
}

export function remove(installedPath: string) {
  const versionDir = path.dirname(installedPath);

  if (!versionDir.startsWith(appsDir)) {
    return;
  }

  fs.rmSync(versionDir, {
    recursive: true,
    force: true,
  });
}
