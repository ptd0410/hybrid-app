import { useItem, useItemStatus, usePickLayoutStore } from "@/hooks";
import { App } from "./App";
import { Frame } from "./Frame";
import { Group } from "./Group";
import { cn } from "@/lib";
import { useDragStore } from "@/modules/drag";

export type MainItemProps = {
  itemId: string;
};

const comps = {
  app: App,
  frame: Frame,
  group: Group,
};

export function MainItem({ itemId }: MainItemProps) {
  const item = useItem(itemId);
  const { selfDrag, isCut, isSelected } = useItemStatus(itemId);
  const dest = useDragStore((s) => s.current?.transformMap?.[itemId]);
  const { main } = usePickLayoutStore();

  if (!item) return null;
  const Comp = comps[item.type as keyof typeof comps];
  if (!Comp) return null;

  const tx = dest ? (dest.x - item.x) * main.size.width : 0;
  const ty = dest ? (dest.y - item.y) * main.size.height : 0;

  return (
    <div
      className={cn(
        "size-full p-2 flex flex-col gap-3 justify-center items-center transition-transform duration-200 ease-out",
        selfDrag && "hidden",
        isCut && "opacity-50",
        isSelected && "border border-white/50",
      )}
      style={{
        gridColumnStart: item.x + 1,
        gridRowStart: item.y + 1,
        gridColumnEnd: `span ${item.col}`,
        gridRowEnd: `span ${item.row}`,
        transform: dest ? `translate(${tx}px, ${ty}px)` : undefined,
        zIndex: dest ? 1 : undefined,
      }}
    >
      <Comp itemId={itemId} />
    </div>
  );
}
