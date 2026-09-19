import { isFsContainer } from "@/api/fs";
import { Desc, Text } from "@/components/ui";
import { fileActions } from "@/hooks";
import { basename } from "@/lib";
import { useFileStore } from "@/modules/file";
import { fsQuery } from "@/modules/fs";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { kindLabel } from "./file.const";

export function FileDialogs() {
  return (
    <>
      <FileInfoDialog />
      <FileRenameDialog />
    </>
  );
}

function FileInfoDialog() {
  const path = useFileStore((s) => s.infoPath);
  const { data, isLoading, error } = useQuery(fsQuery.stat(path ?? ""));

  if (!path) return null;

  return (
    <Overlay onClose={() => useFileStore.getState().setInfoPath(null)}>
      <Text className="mb-3 font-medium">Get Info</Text>
      {isLoading && <Desc className="text-white/55">Loading...</Desc>}
      {error && <Desc className="text-white/55">{error.message}</Desc>}
      {data && (
        <div className="flex flex-col gap-2">
          <InfoRow label="Name" value={basename(data.path)} />
          <InfoRow label="Kind" value={kindLabel[data.type]} />
          <InfoRow
            label="Size"
            value={isFsContainer(data.type) ? "—" : formatSize(data.size)}
          />
          <InfoRow label="Created" value={formatDate(data.createdAt)} />
          <InfoRow label="Modified" value={formatDate(data.modifiedAt)} />
          <InfoRow label="Path" value={data.path} />
        </div>
      )}
    </Overlay>
  );
}

function FileRenameDialog() {
  const path = useFileStore((s) => s.renamePath);
  const [name, setName] = useState("");

  useEffect(() => {
    setName(path ? basename(path) : "");
  }, [path]);

  if (!path) return null;

  return (
    <Overlay onClose={() => useFileStore.getState().setRenamePath(null)}>
      <Text className="mb-3 font-medium">Rename</Text>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void fileActions.submitRename(path, name);
        }}
      >
        <input
          autoFocus
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-md bg-white/10 px-2 py-1.5 text-sm outline-none ring-1 ring-white/15 focus:ring-blue-400/70"
        />
        <div className="mt-3 flex justify-end gap-2">
          <button
            type="button"
            className="rounded-md px-2.5 py-1 text-sm text-white/70 hover:bg-white/10"
            onClick={() => useFileStore.getState().setRenamePath(null)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-blue-500/80 px-2.5 py-1 text-sm hover:bg-blue-500"
          >
            Rename
          </button>
        </div>
      </form>
    </Overlay>
  );
}

function Overlay({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-80 rounded-xl bg-[#2c2c36] p-4 text-white shadow-xl ring-1 ring-white/10"
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <Desc className="w-20 shrink-0 text-white/45">{label}</Desc>
      <Desc className="min-w-0 break-all text-white/80">{value}</Desc>
    </div>
  );
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} bytes`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let index = 0;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[index]}`;
}

function formatDate(ms: number) {
  return new Date(ms).toLocaleString();
}
