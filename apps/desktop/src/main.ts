import { app, ipcMain, net, protocol } from "electron";
import { windowApi } from "./modules/window";
import { metadata } from "./configs";
import { migrateDatabase } from "./database/mrigrate";
import { launchApp } from "./applications";
import { resolve } from "./modules/app";
import path from "path";

ipcMain.handle(
  "app:request",
  async (_event, action: string, data: any = {}) => {
    console.log("thanhduy request", { action, data });
    switch (action) {
      case "openApp": {
        await launchApp(data.id);
        return true;
      }

      case "getAppMetadata":
        return metadata;

      default:
        throw new Error(`Invalid action: ${action}`);
    }
  },
);

app.whenReady().then(() => {
  protocol.handle("app", async (request) => {
    const url = new URL(request.url);

    const appId = url.hostname;
    const appPath = await resolve(appId);

    const filePath = path.join(appPath, url.pathname);

    console.log("filePath:", filePath);

    return net.fetch(`file://${filePath}`);
  });

  migrateDatabase();

  const window = windowApi.createAppWindow("http://localhost:5173");
  // const window = windowApi.createAppWindow("app://home/index.html");
  window.webContents.openDevTools();
});
