import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

if (process.platform !== "darwin") {
  process.exit(0);
}

const require = createRequire(new URL("../package.json", import.meta.url));
const electronBin = require("electron");
const contentsDir = path.resolve(path.dirname(electronBin), "..");
const plistPath = path.join(contentsDir, "Info.plist");
const appPath = path.resolve(contentsDir, "..");

const python = `
import plistlib
import pathlib
import sys

path = pathlib.Path(sys.argv[1])
data = plistlib.loads(path.read_bytes())
updates = {
    "NSDesktopFolderUsageDescription": "Needed to list and manage files on your Desktop.",
    "NSDocumentsFolderUsageDescription": "Needed to list and manage files in Documents.",
    "NSDownloadsFolderUsageDescription": "Needed to list and manage files in Downloads.",
    "NSRemovableVolumesUsageDescription": "Needed to list and manage files on removable drives.",
    "NSNetworkVolumesUsageDescription": "Needed to list and manage files on network volumes.",
}
changed = False
for key, value in updates.items():
    if data.get(key) != value:
        data[key] = value
        changed = True
if changed:
    path.write_bytes(plistlib.dumps(data))
print("changed" if changed else "ok")
`;

const result = execFileSync("python3", ["-c", python, plistPath], {
  encoding: "utf8",
}).trim();

if (result === "changed") {
  execFileSync("codesign", ["--sign", "-", "--force", "--deep", appPath], {
    stdio: "inherit",
  });
}
