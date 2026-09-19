import type {
  FsErrorInfo,
  FsOperation,
  FsOperationKind,
  FsOperationStatus,
} from "./fs.type";
import { FsError, toFsError } from "./fs.error";

const MAX_OPERATIONS = 100;

type InternalOperation = FsOperation & {
  controller: AbortController;
};

export class FsOperationManager {
  private readonly operations = new Map<string, InternalOperation>();

  create(kind: FsOperationKind, paths: string[]): InternalOperation {
    const now = Date.now();
    const operation: InternalOperation = {
      id: crypto.randomUUID(),
      kind,
      status: "pending",
      paths,
      createdAt: now,
      updatedAt: now,
      controller: new AbortController(),
    };
    this.operations.set(operation.id, operation);
    this.prune();
    return operation;
  }

  setStatus(id: string, status: FsOperationStatus, error?: FsErrorInfo) {
    const operation = this.operations.get(id);
    if (!operation) return;
    const now = Date.now();
    operation.status = status;
    operation.updatedAt = now;
    if (status === "running" && !operation.startedAt) {
      operation.startedAt = now;
    }
    if (status === "completed" || status === "failed" || status === "cancelled") {
      operation.finishedAt = now;
    }
    if (error) operation.error = error;
  }

  cancel(id: string) {
    const operation = this.operations.get(id);
    if (!operation) return false;
    if (
      operation.status === "completed" ||
      operation.status === "failed" ||
      operation.status === "cancelled"
    ) {
      return false;
    }
    operation.controller.abort();
    this.setStatus(id, "cancelled", {
      code: "operation_cancelled",
      message: "Operation cancelled",
      path: operation.paths[0],
    });
    return true;
  }

  get(id: string): FsOperation | undefined {
    const operation = this.operations.get(id);
    return operation ? toPublicOperation(operation) : undefined;
  }

  list(): FsOperation[] {
    return [...this.operations.values()]
      .sort((a, b) => b.createdAt - a.createdAt)
      .map(toPublicOperation);
  }

  private prune() {
    if (this.operations.size <= MAX_OPERATIONS) return;
    const finished = [...this.operations.values()]
      .filter(
        (operation) =>
          operation.status === "completed" ||
          operation.status === "failed" ||
          operation.status === "cancelled",
      )
      .sort((a, b) => a.updatedAt - b.updatedAt);
    const extra = this.operations.size - MAX_OPERATIONS;
    for (const operation of finished.slice(0, extra)) {
      this.operations.delete(operation.id);
    }
  }
}

export const fsOperations = new FsOperationManager();

export async function runFsOperation<T>(
  kind: FsOperationKind,
  paths: string[],
  task: (signal: AbortSignal) => Promise<T>,
): Promise<T> {
  const operation = fsOperations.create(kind, paths);
  fsOperations.setStatus(operation.id, "running");
  try {
    if (operation.controller.signal.aborted) {
      throw new FsError("operation_cancelled", { path: paths[0] });
    }
    const result = await task(operation.controller.signal);
    fsOperations.setStatus(operation.id, "completed");
    return result;
  } catch (error) {
    const fsError = toFsError(error, paths[0], paths[1]);
    if (
      fsError.code === "operation_cancelled" ||
      operation.controller.signal.aborted
    ) {
      fsOperations.setStatus(operation.id, "cancelled", fsError.toJSON());
    } else {
      fsOperations.setStatus(operation.id, "failed", fsError.toJSON());
    }
    throw fsError;
  }
}

function toPublicOperation(operation: InternalOperation): FsOperation {
  return {
    id: operation.id,
    kind: operation.kind,
    status: operation.status,
    paths: operation.paths,
    createdAt: operation.createdAt,
    updatedAt: operation.updatedAt,
    startedAt: operation.startedAt,
    finishedAt: operation.finishedAt,
    error: operation.error,
  };
}
