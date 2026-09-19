import { Text } from "@/components/ui";

export function FileStatus({
  isLoading,
  error,
  empty,
}: {
  isLoading: boolean;
  error?: Error | null;
  empty: boolean;
}) {
  if (isLoading) {
    return (
      <div className="px-3 py-2">
        <Text className="text-white/60">Loading...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-3 py-2">
        <Text className="text-white/60">{error.message}</Text>
      </div>
    );
  }

  if (empty) {
    return (
      <div className="px-3 py-2">
        <Text className="text-white/60">Empty folder</Text>
      </div>
    );
  }

  return null;
}

export function FilePager({
  isFetchingNextPage,
}: {
  isFetchingNextPage: boolean;
}) {
  if (!isFetchingNextPage) return null;
  return (
    <div className="px-3 py-2 shrink-0">
      <Text className="text-white/60">Loading...</Text>
    </div>
  );
}
