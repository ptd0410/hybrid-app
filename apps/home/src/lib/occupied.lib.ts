import type { Item } from "@/modules/item";
import type { GridSize, Point } from "@/types";

export function computeOccupied({ x, y }: Point, { col, row }: GridSize) {
  const occupied = [];

  for (let r = 0; r < row; r++) {
    for (let c = 0; c < col; c++) {
      occupied.push({
        x: x + c,
        y: y + r,
      });
    }
  }

  return occupied;
}

export function toPositionString(point: Point, page: number) {
  return `${page}-${point.x}-${point.y}`;
}

export function computeOccupiedMap(
  ids: string[],
  items: Record<string, Item>,
  itemId?: string,
) {
  const occupiedMap: Record<string, string> = {};
  ids.forEach((id) => {
    if (id === itemId) return;
    const metadata = items[id];
    const occupied = computeOccupied(metadata, metadata);
    occupied.forEach((item) => {
      occupiedMap[toPositionString(item, metadata.page)] = id;
    });
  });
  return occupiedMap;
}
