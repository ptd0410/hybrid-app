import { ipcMain } from "electron";

import { appManager } from "./app.manager";

export function registerAppIpc() {
  ipcMain.handle("app:list", () => {
    return appManager.getApps();
  });

  ipcMain.handle("app:get", (_, id: string) => {
    return appManager.getApp(id);
  });
}
