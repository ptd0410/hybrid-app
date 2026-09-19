import { Desc } from "@/components/ui";
import { useDirChildren } from "@/hooks";
import { useActiveStore } from "@/modules/active";

export type StatusBarProps = {};

export function StatusBar({}: StatusBarProps) {
  const root = useActiveStore((s) => s.root);
  const selected = useActiveStore((s) => s.selected);
  const { data } = useDirChildren(root);
  const total = data?.pages[0]?.total ?? 0;
  const selectedCount = selected.length;

  const label =
    selectedCount > 0
      ? `${selectedCount} of ${total} selected`
      : `${total} ${total === 1 ? "item" : "items"}`;

  return (
    <div className="h-7 shrink-0 flex items-center px-3 border-t border-white/10">
      <Desc className="text-white/45">{label}</Desc>
    </div>
  );
}
