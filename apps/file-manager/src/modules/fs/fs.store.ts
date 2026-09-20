import type { FileEntry } from "@/api/fs";
import { create } from "zustand";

export type ClipboardMode = "copy" | "cut";

export type FsClipboard = {
  mode: ClipboardMode;
  paths: string[];
};

const EXTRA_FAVORITES_KEY = "file-manager:extra-favorites";

function loadExtraFavorites(): FileEntry[] {
  try {
    const raw = localStorage.getItem(EXTRA_FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is FileEntry =>
        Boolean(
          item &&
            typeof item === "object" &&
            "path" in item &&
            "name" in item &&
            "type" in item,
        ),
    );
  } catch {
    return [];
  }
}

function saveExtraFavorites(items: FileEntry[]) {
  localStorage.setItem(EXTRA_FAVORITES_KEY, JSON.stringify(items));
}

export type FsStore = {
  clipboard: FsClipboard | null;
  infoPath: string | null;
  renamePath: string | null;
  dragging: FileEntry | null;
  extraFavorites: FileEntry[];
  setClipboard: (clipboard: FsClipboard | null) => void;
  setInfoPath: (path: string | null) => void;
  setRenamePath: (path: string | null) => void;
  setDragging: (entry: FileEntry | null) => void;
  addFavorite: (entry: FileEntry) => void;
  removeFavorite: (path: string) => void;
};

export const useFsStore = create<FsStore>((set, get) => ({
  clipboard: null,
  infoPath: null,
  renamePath: null,
  dragging: null,
  extraFavorites: loadExtraFavorites(),
  setClipboard: (clipboard) => set({ clipboard }),
  setInfoPath: (infoPath) => set({ infoPath }),
  setRenamePath: (renamePath) => set({ renamePath }),
  setDragging: (dragging) => set({ dragging }),
  addFavorite: (entry) => {
    if (get().extraFavorites.some((item) => item.path === entry.path)) return;
    const extraFavorites = [
      ...get().extraFavorites,
      { name: entry.name, path: entry.path, type: entry.type },
    ];
    saveExtraFavorites(extraFavorites);
    set({ extraFavorites });
  },
  removeFavorite: (path) => {
    const extraFavorites = get().extraFavorites.filter(
      (item) => item.path !== path,
    );
    saveExtraFavorites(extraFavorites);
    set({ extraFavorites });
  },
}));
