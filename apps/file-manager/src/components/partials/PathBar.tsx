import { pathSegments } from "@/lib";
import { useClickRoot } from "@/hooks";
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
          <button
            type="button"
            className="hover:bg-white/10 rounded px-1 py-0.5"
            onClick={() => goTo(segment.path)}
          >
            <Text className="text-xs text-white/70">{segment.name}</Text>
          </button>
        </div>
      ))}
    </div>
  );
}
