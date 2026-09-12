// apps/desktop/src/preload.ts

import { contextBridge, ipcRenderer } from "electron";

const electronAPI = {
  window: {
    close: () => ipcRenderer.send("window:close"),

    minimize: () => ipcRenderer.send("window:minimize"),

    maximize: () => ipcRenderer.send("window:maximize"),
  },

  app: {
    getVersion: () => ipcRenderer.invoke("app:get-version"),
  },

  sendMessage: (channel: string, ...args: unknown[]) => {
    ipcRenderer.send(channel, ...args);
  },

  onMessage: (channel: string, callback: (...args: unknown[]) => void) => {
    const listener = (
      _event: Electron.IpcRendererEvent,
      ...args: unknown[]
    ) => {
      callback(...args);
    };

    ipcRenderer.on(channel, listener);

    return () => {
      ipcRenderer.removeListener(channel, listener);
    };
  },

  request: (action: string, data?: unknown) => {
    return ipcRenderer.invoke("app:request", action, data);
  },
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);
