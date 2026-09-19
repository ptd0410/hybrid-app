/**
 * Shared contract for the fs module.
 * Keep this file free of app/UI types so it can move into the fs package later.
 */

export type FileType =
  | "file"
  | "folder"
  | "symlink"
  | "volume"
  | "root"
  | "trash"
  | "unknown";

export const FS_CONTAINER_TYPES = [
  "folder",
  "volume",
  "root",
  "trash",
] as const satisfies readonly FileType[];

export type FsContainerType = (typeof FS_CONTAINER_TYPES)[number];

export function isFsContainer(type: FileType): type is FsContainerType {
  return (
    type === "folder" ||
    type === "volume" ||
    type === "root" ||
    type === "trash"
  );
}

export interface FilePermissions {
  readable: boolean;
  writable: boolean;
  executable?: boolean;
}

export interface FileStat {
  path: string;
  type: FileType;
  size: number;
  createdAt: number;
  modifiedAt: number;
  accessedAt?: number;
  permissions?: FilePermissions;
  hidden?: boolean;
  readonly?: boolean;
}

export interface FileEntry {
  name: string;
  path: string;
  type: FileType;
  size?: number;
  modifiedAt?: number;
  createdAt?: number;
  tags?: string[];
}

export interface DeleteOptions {
  recursive?: boolean;
  force?: boolean;
}

export interface FsPagination {
  page: number;
  pageSize: number;
}

export interface FsPage<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export type FsErrorCode =
  | "permission_denied"
  | "file_not_found"
  | "destination_exists"
  | "disk_full"
  | "operation_cancelled"
  | "unsupported_operation";

export interface FsErrorInfo {
  code: FsErrorCode;
  message: string;
  path?: string;
  dest?: string;
}

export type FsOperationStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export type FsOperationKind =
  | "createFile"
  | "createDir"
  | "readFile"
  | "writeFile"
  | "delete"
  | "copy"
  | "move"
  | "rename";

export interface FsOperation {
  id: string;
  kind: FsOperationKind;
  status: FsOperationStatus;
  paths: string[];
  createdAt: number;
  updatedAt: number;
  startedAt?: number;
  finishedAt?: number;
  error?: FsErrorInfo;
}

export interface FileSystemAPI {
  readDir(
    path: string,
    pagination?: Partial<FsPagination>,
  ): Promise<FsPage<FileEntry>>;
  stat(path: string): Promise<FileStat>;

  createFile(path: string): Promise<void>;
  createDir(path: string): Promise<void>;

  readFile(path: string): Promise<Uint8Array>;
  writeFile(path: string, data: Uint8Array): Promise<void>;

  delete(path: string, options?: DeleteOptions): Promise<void>;
  copy(src: string, dest: string): Promise<void>;
  move(src: string, dest: string): Promise<void>;

  rename(path: string, newName: string): Promise<void>;

  listOperations(): Promise<FsOperation[]>;
  getOperation(id: string): Promise<FsOperation | undefined>;
  cancelOperation(id: string): Promise<boolean>;
}

export interface FsVolume {
  name: string;
  path: string;
}

export type FsApi = FileSystemAPI & {
  volumes: () => Promise<FsVolume[]>;
  favorites: () => Promise<FileEntry[]>;
};
