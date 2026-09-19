import { create } from "zustand";

export type ClipboardMode = "copy" | "cut";

export type FileClipboard = {
  mode: ClipboardMode;
  paths: string[];
};

export type FileStore = {
  clipboard: FileClipboard | null;
  infoPath: string | null;
  renamePath: string | null;
  setClipboard: (clipboard: FileClipboard | null) => void;
  setInfoPath: (path: string | null) => void;
  setRenamePath: (path: string | null) => void;
};

export const useFileStore = create<FileStore>((set) => ({
  clipboard: null,
  infoPath: null,
  renamePath: null,
  setClipboard: (clipboard) => set({ clipboard }),
  setInfoPath: (infoPath) => set({ infoPath }),
  setRenamePath: (renamePath) => set({ renamePath }),
}));
