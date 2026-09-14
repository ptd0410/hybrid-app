import type {
  ColliedItem,
  DragCurrent,
  DragDirection,
  DragDwell,
  DragPreview,
  DragSnapshot,
  Target,
  TransformMap,
} from "@/modules/drag";
import type { Item, ItemLocation } from "@/modules/item";
import type { ClientPoint } from "@/types";
import { resolveHoverKind } from "./collision";
import { displaceOtherItems } from "./displace";
import { shouldRearmPushDwell } from "./dwell";
import { isSameCell } from "./geometry";

export type DragInteraction = {
  groupWith?: string;
  transformMap?: TransformMap;
  dwellAction: "reset" | "keep" | "arm";
  hoverId?: string;
};

type ResolveDragInteractionInput = {
  location: ItemLocation;
  target: Target;
  colliedItems: ColliedItem[];
  clientPoint: ClientPoint;
  snapshot: DragSnapshot;
  items: Record<string, Item>;
  direction?: DragDirection;
  prev?: DragCurrent;
  preview?: DragPreview;
  dwell?: DragDwell;
};

export function resolveDragInteraction({
  location,
  target,
  colliedItems,
  clientPoint,
  snapshot,
  items,
  direction,
  prev,
  preview,
  dwell,
}: ResolveDragInteractionInput): DragInteraction {
  const lockedMainPush =
    location === "main" &&
    !!preview?.transformMap &&
    Object.keys(preview.transformMap).length > 0 &&
    isSameCell(prev?.target, target);

  if (lockedMainPush) {
    return { transformMap: preview?.transformMap, dwellAction: "keep" };
  }

  const hoverKind = resolveHoverKind(
    location,
    colliedItems,
    items,
    clientPoint,
    snapshot.layout,
  );
  const hoverId = hoverKind ? colliedItems[0]?.itemId : undefined;
  const displace = () =>
    displaceOtherItems(
      location,
      colliedItems,
      direction,
      clientPoint,
      snapshot,
      items,
    );

  if (location === "dock" || location === "inGroup") {
    return { hoverId, transformMap: displace(), dwellAction: "reset" };
  }

  if (hoverKind === "group" && hoverId) {
    return { hoverId, groupWith: hoverId, dwellAction: "reset" };
  }

  if (hoverKind === "push" && hoverId) {
    if (dwell?.committed && dwell.itemId === hoverId) {
      return { hoverId, transformMap: displace(), dwellAction: "keep" };
    }
    return {
      hoverId,
      dwellAction: shouldRearmPushDwell(dwell, hoverId, clientPoint)
        ? "arm"
        : "keep",
    };
  }

  return { dwellAction: "reset" };
}
