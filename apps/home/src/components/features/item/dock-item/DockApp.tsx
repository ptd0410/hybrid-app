import type { WithItemId } from "@/types";
import { cn } from "@/lib";
import { useItem, usePickLayoutStore } from "@/hooks";
import { Dragable } from "../../drag";
import { useDragStore } from "@/modules/drag";
import { DockIcon, ItemImage } from "../item.ui";

export type DockAppProps = WithItemId;

export function DockApp({ itemId }: DockAppProps) {
  const item = useItem(itemId);
  const dest = useDragStore((s) => s.current?.transformMap?.[itemId]);
  const { dock } = usePickLayoutStore("dock");
  if (!item) return null;

  const { iconSize, gap } = dock;
  const cell = iconSize + gap;
  const tx = dest ? (dest.x - item.x) * cell : 0;

  return (
    <Dragable
      itemId={itemId}
      className={cn("transition-transform duration-200 ease-out")}
      style={{
        transform: dest ? `translateX(${tx}px)` : undefined,
        zIndex: dest ? 1 : undefined,
      }}
    >
      <DockIcon>
        <ItemImage src={item.icon} />
      </DockIcon>
    </Dragable>
  );
}
