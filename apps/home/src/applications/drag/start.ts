import { getDragStore, type DragSnapshot } from "@/modules/drag";
import type { ReactNode } from "react";
import { dragMove } from "./move";
import { dragEnd } from "./end";
import { getGroupStore } from "@/modules/group";
import { getItemStore } from "@/modules/item";
import { getLayoutStore } from "@/modules/layout";
import { getGridStore } from "@/modules/grid";
import { pick } from "@/lib";
import { computeOccupiedMap } from "@/lib/occupied.lib";
import {
  computeDockLayoutSnapshot,
  computeOffsetSnapshot,
  removeItemId,
  resetDragDwell,
  updateElementPosition,
} from "./helper";

export function dragStart(
  event: React.PointerEvent,
  node: ReactNode,
  originEle: HTMLElement,
  itemId: string,
) {
  const { snapshot, start, ele } = getDragStore();
  const { items } = getItemStore();
  const { main, dock, group, iconSize } = getLayoutStore();
  const { dockIds, mainIds, childrenIdsMap } = getGridStore();
  const { snapshot: groupSnapshot } = getGroupStore();

  const item = items[itemId];

  if ("button" in event && event.button !== 0) return;
  if (!main || !dock || !group) return;
  if (snapshot || !item || !ele) return;

  window.addEventListener("pointermove", dragMove, { capture: true });
  window.addEventListener("pointerup", dragEnd, { capture: true });
  window.addEventListener("pointercancel", dragEnd, { capture: true });

  const { groupId = "" } = groupSnapshot ?? {};

  const bound = originEle.getBoundingClientRect();
  const dockSnapshot = computeDockLayoutSnapshot(dock, dockIds, item.location);
  const layout = { main, group, dock: dockSnapshot, iconSize };
  const childIds = (childrenIdsMap[groupId] ?? []).flat();

  const _snapshot: DragSnapshot = {
    item,
    node,
    layout,
    position: {
      offset: computeOffsetSnapshot(event, bound),
      origin: pick(bound, ["left", "top"]),
    },
    occupied: {
      main: computeOccupiedMap(mainIds.flat(), items, itemId),
      dock: computeOccupiedMap(dockIds, items, itemId),
      group: computeOccupiedMap(childIds, items, itemId),
    },
  };

  resetDragDwell();
  updateElementPosition(ele, bound.left, bound.top);
  removeItemId(item);
  start(_snapshot);
}
