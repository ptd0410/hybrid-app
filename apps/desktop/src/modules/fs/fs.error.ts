import type { FsErrorCode, FsErrorInfo } from "./fs.type";

const FS_ERROR_MESSAGES: Record<FsErrorCode, string> = {
  permission_denied: "Permission denied",
  file_not_found: "File not found",
  destination_exists: "Destination already exists",
  disk_full: "Disk is full",
  operation_cancelled: "Operation cancelled",
  unsupported_operation: "Unsupported operation",
};

const NODE_ERROR_CODES: Record<string, FsErrorCode> = {
  EACCES: "permission_denied",
  EPERM: "permission_denied",
  EROFS: "permission_denied",
  ENOENT: "file_not_found",
  ENOTDIR: "file_not_found",
  EEXIST: "destination_exists",
  ENOTEMPTY: "destination_exists",
  ENOSPC: "disk_full",
  EDQUOT: "disk_full",
  ABORT_ERR: "operation_cancelled",
};

export class FsError extends Error implements FsErrorInfo {
  readonly name = "FsError";
  readonly code: FsErrorCode;
  readonly path?: string;
  readonly dest?: string;

  constructor(
    code: FsErrorCode,
    options: {
      message?: string;
      path?: string;
      dest?: string;
      cause?: unknown;
    } = {},
  ) {
    super(options.message ?? formatFsErrorMessage(code, options.path), {
      cause: options.cause,
    });
    this.code = code;
    this.path = options.path;
    this.dest = options.dest;
  }

  toJSON(): FsErrorInfo {
    return {
      code: this.code,
      message: this.message,
      path: this.path,
      dest: this.dest,
    };
  }
}

export function formatFsErrorMessage(code: FsErrorCode, path?: string) {
  const base = FS_ERROR_MESSAGES[code];
  return path ? `${base}: ${path}` : base;
}

export function isFsError(error: unknown): error is FsError {
  return error instanceof FsError || (isRecord(error) && error.name === "FsError");
}

export function toFsError(error: unknown, path?: string, dest?: string): FsError {
  if (error instanceof FsError) return error;
  if (isAbortError(error)) {
    return new FsError("operation_cancelled", { path, dest, cause: error });
  }

  const node = asNodeError(error);
  const code = node?.code ? NODE_ERROR_CODES[node.code] : undefined;
  return new FsError(code ?? "unsupported_operation", {
    message: node?.message
      ? code
        ? formatFsErrorMessage(code, path)
        : node.message
      : undefined,
    path,
    dest,
    cause: error,
  });
}

export async function withFsError<T>(
  path: string,
  task: () => Promise<T>,
  dest?: string,
): Promise<T> {
  try {
    return await task();
  } catch (error) {
    throw toFsError(error, path, dest);
  }
}

function isAbortError(error: unknown) {
  if (!isRecord(error)) return false;
  return (
    error.name === "AbortError" ||
    error.code === "ABORT_ERR" ||
    error.code === "ERR_CANCELED"
  );
}

function asNodeError(error: unknown): NodeJS.ErrnoException | undefined {
  if (!isRecord(error)) return undefined;
  return error as NodeJS.ErrnoException;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
