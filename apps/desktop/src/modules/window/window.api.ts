import { BrowserWindow } from "electron";

export const windowApi = {
  createAppWindow(url: string) {
    console.log("createAppWindow 1", { url });
    const window = new BrowserWindow({
      width: 1000,
      height: 700,
      webPreferences: {
        //   preload: new URL("./preload.ts", import.meta.url).pathname,
        preload: new URL("../dist/preload.cjs", import.meta.url).pathname,
        contextIsolation: true,
        nodeIntegration: false,
      },
    });
    console.log("createAppWindow 2", { url });

    window.loadURL(url);
    return window;
  },
};
