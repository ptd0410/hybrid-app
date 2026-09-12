import { getDragStore, type DragSnapshot } from "@/modules/drag";
import type { ReactNode } from "react";
import { dragMove } from "./move";
import { dragEnd } from "./end";
import { getItemStore } from "@/modules/item";
import { getLayoutStore } from "@/modules/layout";
import {
  computeDockLayoutSnapshot,
  computeOffsetPosition,
} from "./drag.shared";
import { getGridStore } from "@/modules/grid";
import { pick } from "@/lib";
import { computeOccupiedMap } from "@/lib/occupied.lib";
import { getGroupStore } from "@/modules/group";
import { getRelationStore } from "@/modules/relation";

export function dragStart(
  event: React.PointerEvent,
  node: ReactNode,
  originEle: HTMLElement,
  itemId: string,
) {
  const { snapshot, start } = getDragStore();
  const { items } = getItemStore();
  const { main, dock, group } = getLayoutStore();
  const { dockIds, mainIds } = getGridStore();
  const { groupId } = getGroupStore();
  const { children } = getRelationStore();

  const item = items[itemId];

  if ("button" in event && event.button !== 0) return;
  if (!main || !dock || !group) return;
  if (snapshot || !item) return;

  window.addEventListener("pointermove", dragMove, { capture: true });
  window.addEventListener("pointerup", dragEnd, { capture: true });
  window.addEventListener("pointercancel", dragEnd, { capture: true });

  const bound = originEle.getBoundingClientRect();
  const dockSnapshot = computeDockLayoutSnapshot(dock, dockIds, item.location);
  const layout = { main, group, dock: dockSnapshot };
  const childIds = children[groupId] ?? [];

  const _snapshot: DragSnapshot = {
    item,
    node,
    layout,
    position: {
      offset: computeOffsetPosition(event, bound),
      origin: pick(bound, ["left", "top"]),
    },
    occupied: {
      main: computeOccupiedMap(mainIds.flat(), items, itemId),
      dock: computeOccupiedMap(dockIds, items, itemId),
      group: computeOccupiedMap(childIds, items, itemId),
    },
  };

  start(_snapshot);
}
