import { usePickDragSnapshot, usePickDragStore } from "@/hooks";
import { cn } from "@/lib";

export type DragItemProps = {};

export function DragItem({}: DragItemProps) {
  const { node } = usePickDragSnapshot("node");
  const { initEle } = usePickDragStore("initEle");

  return (
    <div
      ref={initEle}
      className={cn(
        "fixed pointer-events-none z-9999 left-0 top-0",
        !node && "hidden",
      )}
    >
      {node}
    </div>
  );
}
