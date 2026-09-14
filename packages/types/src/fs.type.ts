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

export type FsApi = {
  readDir: (dirPath: string) => Promise<FsEntry[]>;
  volumes: () => Promise<FsVolume[]>;
  favorites: () => Promise<FsEntry[]>;
};
