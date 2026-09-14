export type FsEntryType = "file" | "directory";

export interface FsEntry {
  name: string;
  path: string;
  type: FsEntryType;
}

export interface FsVolume {
  name: string;
  path: string;
}
