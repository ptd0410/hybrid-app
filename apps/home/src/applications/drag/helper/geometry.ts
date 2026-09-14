import { clamp } from "@/lib";
import type {
  DragCurrent,
  DragDirection,
  LayoutSnapshot,
  Target,
} from "@/modules/drag";
import type { ItemLocation } from "@/modules/item";
import type { Bound, ClientPoint, Point } from "@/types";

const ICON_EDGE_RATIO = 0.15;

export type DetectLocationOptions = {
  prev?: Target;
  isGroupOpen?: boolean;
};

export function detectLocation(
  clientPoint: ClientPoint,
  layout: LayoutSnapshot,
  options: DetectLocationOptions = {},
): ItemLocation {
  const { clientX, clientY } = clientPoint;
  const { main, dock, group } = layout;
  const { isGroupOpen, prev } = options;

  const isInBound = (bound: Bound) =>
    clientX > bound.left &&
    clientX < bound.right &&
    clientY > bound.top &&
    clientY < bound.bottom;

  // group
  if (isGroupOpen && isInBound(group.bound)) return "inGroup";

  // dock
  const dockBound = prev?.location === "dock" ? dock.boundIn : dock.boundOut;
  if (isInBound(dockBound)) return "dock";

  // main
  const { statusbarHeight, size, paddingX } = main;
  const isInContainer =
    clientY > statusbarHeight && clientY < statusbarHeight + size.height;

  if (clientX > paddingX && clientX < paddingX + size.width && isInContainer) {
    return "main";
  }

  //main left
  if (clientX < paddingX && isInContainer) {
    return "mainLeft";
  }

  //main right
  if (clientX > paddingX + size.width && isInContainer) {
    return "mainRight";
  }

  return "null";
}

export function computePoint(
  clientPoint: ClientPoint,
  location: ItemLocation | undefined,
  layout: LayoutSnapshot,
): Point | undefined {
  const { main, dock, group } = layout;
  const { clientX, clientY } = clientPoint;

  switch (location) {
    case "main": {
      const { paddingX, statusbarHeight, grid, cell } = main;
      const x = Math.floor((clientX - paddingX) / cell.width);
      const y = Math.floor((clientY - statusbarHeight) / cell.height);
      return {
        x: clamp(x, 0, grid.col - 1),
        y: clamp(y, 0, grid.row - 1),
      };
    }
    case "dock": {
      const { iconSize, gap, paddingX, boundIn } = dock;
      const { left, right } = boundIn;
      const cell = iconSize + gap;
      const x = Math.floor((clientX - left - paddingX) / cell);
      const slots = Math.round((right - left - paddingX * 2 + gap) / cell);
      return {
        x: clamp(x, 0, Math.max(0, slots - 1)),
        y: 0,
      };
    }
    case "inGroup": {
      const { paddingX, paddingY, grid, size, bound } = group;
      const x = Math.floor((clientX - bound.left - paddingX) / size.width);
      const y = Math.floor((clientY - bound.top - paddingY) / size.height);
      return {
        x: clamp(x, 0, grid.col - 1),
        y: clamp(y, 0, grid.row - 1),
      };
    }
  }
}

export function isSameCell(a?: Target, b?: Target) {
  return (
    !!a &&
    !!b &&
    a.x === b.x &&
    a.y === b.y &&
    a.page === b.page &&
    a.location === b.location
  );
}

export function getMainIconBound(item: Point, layout: LayoutSnapshot): Bound {
  const { iconSize, main } = layout;
  const { cell, paddingX, statusbarHeight } = main;
  const insetX = (cell.width - iconSize) / 2;
  const insetY = (cell.height - iconSize - 12 - 14) / 2;
  const left = item.x * cell.width + paddingX + insetX;
  const top = item.y * cell.height + statusbarHeight + insetY;
  return {
    left,
    top,
    right: left + iconSize,
    bottom: top + iconSize,
  };
}

function isPointerInBound(clientPoint: ClientPoint, bound: Bound) {
  return (
    clientPoint.clientX >= bound.left &&
    clientPoint.clientX <= bound.right &&
    clientPoint.clientY >= bound.top &&
    clientPoint.clientY <= bound.bottom
  );
}

function getIconInnerBound(icon: Bound): Bound {
  const insetX = (icon.right - icon.left) * ICON_EDGE_RATIO;
  const insetY = (icon.bottom - icon.top) * ICON_EDGE_RATIO;
  return {
    left: icon.left + insetX,
    top: icon.top + insetY,
    right: icon.right - insetX,
    bottom: icon.bottom - insetY,
  };
}

export function isPointerInIconEdge(
  clientPoint: ClientPoint,
  item: Point,
  layout: LayoutSnapshot,
) {
  const icon = getMainIconBound(item, layout);
  if (!isPointerInBound(clientPoint, icon)) return false;
  return !isPointerInBound(clientPoint, getIconInnerBound(icon));
}

export function getDockGridSize(layout: LayoutSnapshot) {
  const { iconSize, gap, paddingX, boundIn } = layout.dock;
  const cell = iconSize + gap;
  const slots = Math.round(
    (boundIn.right - boundIn.left - paddingX * 2 + gap) / cell,
  );
  return { col: Math.max(1, slots), row: 1 };
}

export function computeDirection(
  clientPoint: ClientPoint,
  prev: DragCurrent | undefined,
): DragDirection | undefined {
  if (!prev) return undefined;

  const dx = clientPoint.clientX - prev.clientPoint.clientX;
  const dy = clientPoint.clientY - prev.clientPoint.clientY;
  if (dx === 0 && dy === 0) return prev.direction;

  if (Math.abs(dx) >= Math.abs(dy)) return dx > 0 ? "right" : "left";
  return dy > 0 ? "down" : "up";
}
