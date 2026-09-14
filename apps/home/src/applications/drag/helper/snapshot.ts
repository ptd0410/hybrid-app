import type { DockLayoutSnapshot } from "@/modules/drag";
import type { ItemLocation } from "@/modules/item";
import type { DockLayout } from "@/modules/layout";
import type { Bound, ClientPoint, Position } from "@/types";

export function computeDockLayoutSnapshot(
  dock: DockLayout,
  dockIds: string[],
  location: ItemLocation,
): DockLayoutSnapshot {
  const ele = document.getElementById("dock");
  if (!ele) throw Error("Dock element not found");
  const { length } = dockIds;
  const { top, bottom, left } = ele.getBoundingClientRect();
  const { iconSize, paddingX, gap } = dock;
  const cell = (iconSize + gap) / 2;
  const isDock = location === "dock";

  function computeBound(size: number, left: number) {
    const width = paddingX * 2 + iconSize * size + gap * (size - 1);
    const right = left + width;
    return { left, right, top, bottom, width };
  }

  return {
    ...dock,
    boundIn: computeBound(
      isDock ? length : length + 1,
      isDock ? left : left - cell,
    ),
    boundOut: computeBound(
      isDock ? length - 1 : length,
      isDock ? left + cell : left,
    ),
    iconSize,
  };
}

export function computeOffsetSnapshot(
  point: ClientPoint,
  bound: Bound,
): Position {
  return {
    left: point.clientX - bound.left,
    top: point.clientY - bound.top,
  };
}
