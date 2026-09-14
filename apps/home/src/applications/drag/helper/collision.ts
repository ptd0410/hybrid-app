import {
  type ColliedItem,
  type DragSnapshot,
  type HoverKind,
  type LayoutSnapshot,
  type OccupedSnapshot,
  type Target,
} from "@/modules/drag";
import type { Item, ItemLocation } from "@/modules/item";
import { computeOccupied, toPositionString } from "@/lib/occupied.lib";
import type { ClientPoint } from "@/types";
import { isPointerInIconEdge } from "./geometry";

export function canDisplaceItem(item: Item | undefined) {
  return (
    !!item &&
    ["app", "group"].includes(item.type) &&
    item.col === 1 &&
    item.row === 1
  );
}

export function getOccupiedMap(
  occupied: OccupedSnapshot,
  location: ItemLocation | undefined,
) {
  switch (location) {
    case "main":
      return occupied.main;
    case "dock":
      return occupied.dock;
    case "inGroup":
      return occupied.group;
    default:
      return {};
  }
}

export function getColliedItems(snapshot: DragSnapshot, target: Target) {
  if (target.x == null || target.y == null) return [];

  const occupiedMap = getOccupiedMap(snapshot.occupied, target.location);
  const occupied = computeOccupied(
    { x: target.x, y: target.y },
    snapshot.item,
  );

  return occupied
    .map((cell) => {
      const itemId = occupiedMap[toPositionString(cell, target.page)];
      return itemId
        ? { itemId, page: target.page, ...cell }
        : undefined;
    })
    .filter(Boolean) as ColliedItem[];
}

export function resolveHoverKind(
  location: ItemLocation | undefined,
  colliedItems: ColliedItem[],
  items: Record<string, Item>,
  clientPoint: ClientPoint,
  layout: LayoutSnapshot,
): HoverKind | undefined {
  if (colliedItems.length !== 1) return;
  const item = items[colliedItems[0].itemId];
  if (!item) return;

  if (location === "main") {
    if (!["app", "group"].includes(item.type)) return;
    if (canDisplaceItem(item) && isPointerInIconEdge(clientPoint, item, layout)) {
      return "push";
    }
    return "group";
  }

  if (location === "dock" || location === "inGroup") {
    if (!canDisplaceItem(item)) return;
    return "push";
  }
}
