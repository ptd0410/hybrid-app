import { fileDropOverClass, useClickRoot, useFolderDrop } from "@/hooks";
import { cn, pathSegments } from "@/lib";
import { useActiveStore } from "@/modules/active";
import { Tag, Text } from "../ui";

export type PathBarProps = {};

export function PathBar({}: PathBarProps) {
  const root = useActiveStore((s) => s.root);
  const goTo = useClickRoot();
  const segments = pathSegments(root);

  if (!segments.length) return null;

  return (
    <div className="h-7 shrink-0 flex items-center gap-1 px-3 overflow-auto border-t border-white/10">
      {segments.map((segment, index) => (
        <div key={segment.path} className="flex items-center gap-1 shrink-0">
          {index > 0 && (
            <Tag name="ChevronRight" size={12} className="text-white/35" />
          )}
          <PathSegment
            name={segment.name}
            path={segment.path}
            onOpen={() => goTo(segment.path)}
          />
        </div>
      ))}
    </div>
  );
}

function PathSegment({
  name,
  path,
  onOpen,
}: {
  name: string;
  path: string;
  onOpen: () => void;
}) {
  const { isOver, dropProps } = useFolderDrop(path);

  return (
    <button
      type="button"
      className={cn(
        "hover:bg-white/10 rounded px-1 py-0.5",
        isOver && fileDropOverClass,
      )}
      onClick={onOpen}
      {...dropProps}
    >
      <Text className="text-xs text-white/70">{name}</Text>
    </button>
  );
}
