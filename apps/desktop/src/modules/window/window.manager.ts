import { BrowserWindow } from "electron";
import { windowApi } from "./window.api";

export interface OpenWindowOptions {
  id: string;
  url: string;
}

class WindowManager {
  private windows = new Map<string, BrowserWindow>();

  get(id: string) {
    const window = this.windows.get(id);

    if (!window || window.isDestroyed()) {
      this.windows.delete(id);
      return undefined;
    }

    return window;
  }

  open({ id, url }: OpenWindowOptions) {
    const existing = this.get(id);

    if (existing) {
      existing.focus();
      return existing;
    }

    const window = windowApi.createAppWindow(url);

    this.windows.set(id, window);

    window.on("closed", () => {
      this.windows.delete(id);
    });

    return window;
  }

  close(id: string) {
    const window = this.get(id);

    if (!window) {
      return;
    }

    window.close();
  }

  focus(id: string) {
    const window = this.get(id);

    if (!window) {
      return;
    }

    window.focus();
  }

  has(id: string) {
    return !!this.get(id);
  }
}

export const windowManager = new WindowManager();
