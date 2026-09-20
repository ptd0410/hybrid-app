export function basename(filePath: string) {
  const parts = filePath.split(/[/\\]/).filter(Boolean);
  return parts.at(-1) ?? filePath;
}

export function joinPath(dir: string, name: string) {
  if (!dir) return name;
  if (dir === "/") return `/${name}`;
  if (/^[A-Za-z]:\\?$/.test(dir)) {
    const root = dir.endsWith("\\") ? dir : `${dir}\\`;
    return `${root}${name}`;
  }
  const sep = dir.includes("\\") ? "\\" : "/";
  return dir.endsWith(sep) ? `${dir}${name}` : `${dir}${sep}${name}`;
}

export function splitName(name: string) {
  const index = name.lastIndexOf(".");
  if (index <= 0) return { stem: name, ext: "" };
  return { stem: name.slice(0, index), ext: name.slice(index) };
}

export function uniqueName(existing: Iterable<string>, name: string) {
  const names = existing instanceof Set ? existing : new Set(existing);
  if (!names.has(name)) return name;
  const { stem, ext } = splitName(name);
  let n = 2;
  let next = `${stem} ${n}${ext}`;
  while (names.has(next)) {
    n += 1;
    next = `${stem} ${n}${ext}`;
  }
  return next;
}

export function duplicateName(existing: Iterable<string>, name: string) {
  const { stem, ext } = splitName(name);
  return uniqueName(existing, `${stem} copy${ext}`);
}

export function parentPath(filePath: string) {
  if (!filePath || filePath === "/") return undefined;
  if (/^[A-Za-z]:\\?$/.test(filePath)) return undefined;

  const unix = filePath.startsWith("/");
  const parts = filePath.split(/[/\\]/).filter(Boolean);
  if (parts.length === 0) return undefined;

  parts.pop();
  if (unix) return parts.length ? `/${parts.join("/")}` : "/";
  return parts.join("\\");
}

export function normalizePath(filePath: string) {
  if (!filePath) return "";
  if (filePath === "/" || /^[A-Za-z]:\\?$/.test(filePath)) return filePath;
  return filePath.replace(/[/\\]+$/, "");
}

export function samePath(a: string, b: string) {
  return normalizePath(a) === normalizePath(b);
}

export function isPathInside(parent: string, child: string) {
  const root = normalizePath(parent);
  const target = normalizePath(child);
  if (!root || !target || samePath(root, target)) return false;
  const sep = root.includes("\\") ? "\\" : "/";
  const prefix = root.endsWith(sep) ? root : `${root}${sep}`;
  return target.startsWith(prefix);
}

export function canMoveInto(src: string, destDir: string) {
  if (!src || !destDir) return false;
  if (samePath(src, destDir)) return false;
  if (isPathInside(src, destDir)) return false;
  const parent = parentPath(src);
  return !parent || !samePath(parent, destDir);
}

export function pathSegments(filePath: string) {
  if (!filePath) return [];

  const unix = filePath.startsWith("/");
  const parts = filePath.split(/[/\\]/).filter(Boolean);
  const segments: { name: string; path: string }[] = [];

  if (unix) {
    segments.push({ name: "/", path: "/" });
    let acc = "";
    for (const part of parts) {
      acc += `/${part}`;
      segments.push({ name: part, path: acc });
    }
    return segments;
  }

  let acc = "";
  for (const [index, part] of parts.entries()) {
    acc = index === 0 ? part : `${acc}\\${part}`;
    segments.push({ name: part, path: acc });
  }
  return segments;
}
