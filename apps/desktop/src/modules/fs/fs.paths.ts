import os from "node:os";
import path from "node:path";

export function normalizeFsPath(targetPath: string) {
  if (!targetPath) return targetPath;
  if (targetPath === "/") return "/";
  if (/^[A-Za-z]:\\?$/.test(targetPath)) {
    return `${targetPath[0]?.toUpperCase()}:\\`;
  }
  return path.resolve(targetPath);
}

export function isSameFsPath(left: string, right: string) {
  const a = normalizeFsPath(left);
  const b = normalizeFsPath(right);
  if (process.platform === "win32") return a.toLowerCase() === b.toLowerCase();
  return a === b;
}

export function getRootPaths() {
  if (process.platform === "win32") {
    return Array.from(
      { length: 26 },
      (_, index) => `${String.fromCharCode(65 + index)}:\\`,
    );
  }
  return ["/"];
}

export function getTrashPaths() {
  const home = os.homedir();
  if (process.platform === "darwin") return [path.join(home, ".Trash")];
  if (process.platform === "win32") {
    return getRootPaths().map((root) => path.join(root, "$Recycle.Bin"));
  }
  return [path.join(home, ".local/share/Trash")];
}

export function isRootPath(targetPath: string) {
  const normalized = normalizeFsPath(targetPath);
  return getRootPaths().some((root) => isSameFsPath(root, normalized));
}

export function isTrashPath(targetPath: string) {
  const normalized = normalizeFsPath(targetPath);
  if (getTrashPaths().some((trash) => isSameFsPath(trash, normalized))) {
    return true;
  }
  const base = path.basename(normalized);
  return (
    base === ".Trash" ||
    base === "$Recycle.Bin" ||
    normalized.endsWith(`${path.sep}Trash`)
  );
}
