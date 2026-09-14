import { usePickDragCurrent, usePickDragPreview } from "@/hooks";

export type SnapPreviewProps = {};

export function SnapPreview({}: SnapPreviewProps) {
  const { snap } = usePickDragCurrent("snap");
  const { groupWith } = usePickDragPreview("groupWith");

  if (!snap) return null;
  if (groupWith) return null;

  return (
    <div
      className="fixed pointer-events-none z-40"
      style={{
        left: snap.left,
        top: snap.top,
        width: snap.iconSize,
        height: snap.iconSize,
      }}
    >
      <div className="size-full border-2 border-white bg-white/20 rounded-2xl" />
    </div>
  );
}
