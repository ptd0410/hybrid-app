// app-path.ts
import path from "node:path";
import { app } from "electron";

export function getAppsDir(type: "apps" | "downloads") {
  return path.join(app.getPath("userData"), type);
}
