/**
 * Public fs contract. Source of truth currently lives in `types`
 * so renderer and main can share it. Move that file here when this
 * module becomes its own package.
 */
export type {
  DeleteOptions,
  FileEntry,
  FilePermissions,
  FileStat,
  FileSystemAPI,
  FileType,
  FsApi,
  FsContainerType,
  FsErrorCode,
  FsErrorInfo,
  FsOperation,
  FsOperationKind,
  FsOperationStatus,
  FsPage,
  FsPagination,
  FsVolume,
} from "types";

export { FS_CONTAINER_TYPES, isFsContainer } from "types";
