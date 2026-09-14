import { toPositionString } from "@/lib/occupied.lib";
import type {
  ColliedItem,
  DragDirection,
  DragSnapshot,
  TransformMap,
} from "@/modules/drag";
import type { Item, ItemLocation } from "@/modules/item";
import type { ClientPoint, GridSize, Point } from "@/types";
import { canDisplaceItem, getOccupiedMap } from "./collision";
import { getDockGridSize, isPointerInIconEdge } from "./geometry";

function shiftAlongAxis(
  start: Point,
  dx: number,
  dy: number,
  page: number,
  occupiedMap: Record<string, string>,
  items: Record<string, Item>,
  gridSize: GridSize,
): TransformMap | undefined {
  const chain: { id: string; x: number; y: number }[] = [];
  let x = start.x;
  let y = start.y;

  while (true) {
    if (x < 0 || y < 0 || x >= gridSize.col || y >= gridSize.row) return;

    const id = occupiedMap[toPositionString({ x, y }, page)];
    if (!id) {
      if (chain.length === 0) return;
      const map: TransformMap = {};
      for (const item of chain) {
        map[item.id] = { x: item.x + dx, y: item.y + dy };
      }
      return map;
    }

    const item = items[id];
    if (!canDisplaceItem(item)) return;
    if (chain.some((entry) => entry.id === id)) return;

    chain.push({ id, x, y });
    x += dx;
    y += dy;
  }
}

function directionDelta(direction: DragDirection): Point {
  switch (direction) {
    case "left":
      return { x: -1, y: 0 };
    case "right":
      return { x: 1, y: 0 };
    case "up":
      return { x: 0, y: -1 };
    case "down":
      return { x: 0, y: 1 };
  }
}

function fallbackDirections(direction: DragDirection): DragDirection[] {
  switch (direction) {
    case "left":
    case "right":
      return [direction, "down", "up", direction === "right" ? "left" : "right"];
    case "up":
    case "down":
      return [direction, "right", "left", direction === "down" ? "up" : "down"];
  }
}

function flowCells(gridSize: GridSize): Point[] {
  const cells: Point[] = [];
  for (let y = 0; y < gridSize.row; y++) {
    for (let x = 0; x < gridSize.col; x++) {
      cells.push({ x, y });
    }
  }
  return cells;
}

function shiftInFlow(
  start: Point,
  reverse: boolean,
  page: number,
  occupiedMap: Record<string, string>,
  items: Record<string, Item>,
  gridSize: GridSize,
): TransformMap | undefined {
  const cells = flowCells(gridSize);
  const startIdx = cells.findIndex(
    (cell) => cell.x === start.x && cell.y === start.y,
  );
  if (startIdx < 0) return;

  const step = reverse ? -1 : 1;
  const chain: { id: string; from: number }[] = [];

  for (let i = startIdx; i >= 0 && i < cells.length; i += step) {
    const cell = cells[i];
    const id = occupiedMap[toPositionString(cell, page)];
    if (!id) {
      if (chain.length === 0) return;
      const map: TransformMap = {};
      for (const entry of chain) {
        map[entry.id] = cells[entry.from + step];
      }
      return map;
    }

    if (!canDisplaceItem(items[id])) return;
    if (chain.some((entry) => entry.id === id)) return;
    chain.push({ id, from: i });
  }
}

export function displaceOtherItems(
  location: ItemLocation | undefined,
  colliedItems: ColliedItem[],
  direction: DragDirection | undefined,
  clientPoint: ClientPoint,
  snapshot: DragSnapshot,
  items: Record<string, Item>,
): TransformMap | undefined {
  if (colliedItems.length !== 1) return;
  if (location !== "main" && location !== "dock" && location !== "inGroup") {
    return;
  }

  const collied = colliedItems[0];
  const item = items[collied.itemId];
  if (!canDisplaceItem(item)) return;

  const start = { x: item.x, y: item.y };
  const occupiedMap = getOccupiedMap(snapshot.occupied, location);
  const dir = direction ?? "right";

  if (location === "main") {
    if (!isPointerInIconEdge(clientPoint, item, snapshot.layout)) return;
    const { grid } = snapshot.layout.main;
    for (const next of fallbackDirections(dir)) {
      const { x: dx, y: dy } = directionDelta(next);
      const shifted = shiftAlongAxis(
        start,
        dx,
        dy,
        collied.page,
        occupiedMap,
        items,
        grid,
      );
      if (shifted) return shifted;
    }
    return;
  }

  const gridSize =
    location === "dock"
      ? getDockGridSize(snapshot.layout)
      : snapshot.layout.group.grid;
  const reverse = dir === "left" || dir === "up";
  return (
    shiftInFlow(start, reverse, collied.page, occupiedMap, items, gridSize) ??
    shiftInFlow(start, !reverse, collied.page, occupiedMap, items, gridSize)
  );
}
