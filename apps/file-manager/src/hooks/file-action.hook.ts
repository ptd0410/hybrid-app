import { fsApi, isFsContainer, type FileEntry } from "@/api/fs";
import { queryClient } from "@/clients";
import {
  basename,
  duplicateName,
  joinPath,
  parentPath,
  uniqueName,
} from "@/lib";
import { useActiveStore } from "@/modules/active";
import { useFileStore } from "@/modules/file";
import { useCallback, useEffect } from "react";
import { useClickRoot } from "./a.hook";

function selectedPaths(entry?: FileEntry) {
  const { selected } = useActiveStore.getState();
  if (!entry) return selected;
  return selected.includes(entry.path) ? selected : [entry.path];
}

async function existingNames(dir: string) {
  const page = await fsApi.readDir(dir, { page: 1, pageSize: 10_000 });
  return new Set(page.items.map((item) => item.name));
}

async function invalidateFs() {
  await queryClient.invalidateQueries({ queryKey: ["dirChildren"] });
}

async function run(action: () => Promise<void>) {
  try {
    await action();
    await invalidateFs();
  } catch (error) {
    window.alert(error instanceof Error ? error.message : "Action failed");
  }
}

export const fileActions = {
  getInfo(entry?: FileEntry) {
    const path =
      entry?.path ?? selectedPaths().at(-1) ?? useActiveStore.getState().root;
    if (path) useFileStore.getState().setInfoPath(path);
  },
  newFolder(dir?: string) {
    const target = dir ?? useActiveStore.getState().root;
    if (!target) return;
    void run(async () => {
      const names = await existingNames(target);
      const destName = uniqueName(names, "untitled folder");
      const dest = joinPath(target, destName);
      await fsApi.createDir(dest);
      useActiveStore.getState().setSelected([dest]);
      useFileStore.getState().setRenamePath(dest);
    });
  },
  startRename(entry: FileEntry) {
    useFileStore.getState().setRenamePath(entry.path);
  },
  copy(entry?: FileEntry) {
    const paths = selectedPaths(entry);
    if (!paths.length) return;
    useFileStore.getState().setClipboard({ mode: "copy", paths });
  },
  cut(entry?: FileEntry) {
    const paths = selectedPaths(entry);
    if (!paths.length) return;
    useFileStore.getState().setClipboard({ mode: "cut", paths });
  },
  async copyPath(entry?: FileEntry) {
    const paths = selectedPaths(entry);
    if (!paths.length) return;
    await navigator.clipboard.writeText(paths.join("\n"));
  },
  duplicate(entry?: FileEntry) {
    const paths = selectedPaths(entry);
    if (!paths.length) return;
    void run(async () => {
      for (const src of paths) {
        const parent = parentPath(src);
        if (!parent) continue;
        const names = await existingNames(parent);
        const destName = duplicateName(names, basename(src));
        names.add(destName);
        await fsApi.copy(src, joinPath(parent, destName));
      }
    });
  },
  paste(destDir?: string) {
    const clip = useFileStore.getState().clipboard;
    if (!clip?.paths.length) return;
    const target = destDir ?? useActiveStore.getState().root;
    if (!target) return;
    void run(async () => {
      const names = await existingNames(target);
      for (const src of clip.paths) {
        const destName = uniqueName(names, basename(src));
        names.add(destName);
        const dest = joinPath(target, destName);
        if (clip.mode === "cut") await fsApi.move(src, dest);
        else await fsApi.copy(src, dest);
      }
      if (clip.mode === "cut") useFileStore.getState().setClipboard(null);
    });
  },
  remove(entry?: FileEntry) {
    const paths = selectedPaths(entry);
    if (!paths.length) return;
    const label =
      paths.length === 1 ? basename(paths[0] ?? "") : `${paths.length} items`;
    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) return;
    void run(async () => {
      for (const path of paths) {
        await fsApi.delete(path, { recursive: true, force: true });
      }
      const selected = useActiveStore.getState().selected;
      useActiveStore
        .getState()
        .setSelected(selected.filter((path) => !paths.includes(path)));
    });
  },
  async submitRename(path: string, nextName: string) {
    const name = nextName.trim();
    if (!name || name === basename(path)) {
      useFileStore.getState().setRenamePath(null);
      return;
    }
    if (/[/\\]/.test(name)) {
      window.alert("Name cannot contain slashes.");
      return;
    }
    await run(async () => {
      await fsApi.rename(path, name);
      const parent = parentPath(path);
      const nextPath = parent ? joinPath(parent, name) : name;
      const selected = useActiveStore.getState().selected;
      useActiveStore
        .getState()
        .setSelected(selected.map((item) => (item === path ? nextPath : item)));
      useFileStore.getState().setRenamePath(null);
    });
  },
};

export function useFileActions() {
  const clipboard = useFileStore((s) => s.clipboard);
  const goTo = useClickRoot();
  const open = useCallback(
    (entry: FileEntry) => {
      if (isFsContainer(entry.type)) goTo(entry.path);
    },
    [goTo],
  );

  return { clipboard, open, ...fileActions };
}

export function useFileActionHotkeys() {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const meta = event.metaKey || event.ctrlKey;
      const selected = useActiveStore.getState().selected;
      const current = selected.at(-1);

      if (meta && event.key.toLowerCase() === "c") {
        event.preventDefault();
        fileActions.copy();
        return;
      }
      if (meta && event.key.toLowerCase() === "x") {
        event.preventDefault();
        fileActions.cut();
        return;
      }
      if (meta && event.key.toLowerCase() === "v") {
        event.preventDefault();
        fileActions.paste();
        return;
      }
      if (meta && event.key.toLowerCase() === "d") {
        event.preventDefault();
        fileActions.duplicate();
        return;
      }
      if (meta && event.shiftKey && event.key.toLowerCase() === "n") {
        event.preventDefault();
        fileActions.newFolder();
        return;
      }
      if (meta && event.key.toLowerCase() === "i") {
        event.preventDefault();
        fileActions.getInfo();
        return;
      }
      if (event.key === "F2" && current) {
        event.preventDefault();
        useFileStore.getState().setRenamePath(current);
        return;
      }
      if (meta && (event.key === "Backspace" || event.key === "Delete")) {
        if (!selected.length) return;
        event.preventDefault();
        fileActions.remove();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
