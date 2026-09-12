import { useItemMetadata, useLayout } from "@/hooks";
import { DApp } from "./DApp";
import { Frame } from "./Frame";
import { Group } from "./Group";
import { useItemStatus } from "@/applications";
import { cn } from "@/lib";
import { useDragStore } from "@/logic";

export type MainItemProps = {
  itemId: string;
};

const comps = {
  app: DApp,
  frame: Frame,
  group: Group,
};

export function MainItem({ itemId }: MainItemProps) {
  const metadata = useItemMetadata(itemId);
  const { selfDrag, isCut, isSelected } = useItemStatus(itemId);
  const dest = useDragStore((s) => s.current?.transformMap?.[itemId]);
  const { cell } = useLayout();

  if (!metadata) return null;
  const Comp = comps[metadata.type as keyof typeof comps];
  if (!Comp) return null;

  const tx = dest ? (dest.x - metadata.x) * cell.width : 0;
  const ty = dest ? (dest.y - metadata.y) * cell.height : 0;

  return (
    <div
      className={cn(
        "size-full p-2 flex flex-col gap-3 justify-center items-center transition-transform duration-200 ease-out",
        selfDrag && "hidden",
        isCut && "opacity-50",
        isSelected && "border border-white/50",
      )}
      style={{
        gridColumnStart: metadata.x + 1,
        gridRowStart: metadata.y + 1,
        gridColumnEnd: `span ${metadata.width}`,
        gridRowEnd: `span ${metadata.height}`,
        transform: dest ? `translate(${tx}px, ${ty}px)` : undefined,
        zIndex: dest ? 1 : undefined,
      }}
    >
      <Comp itemId={itemId} />
    </div>
  );
}
