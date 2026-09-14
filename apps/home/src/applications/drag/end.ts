import { getDragStore } from "@/modules/drag";
import {
  addItemId,
  animateEnd,
  cancelScheduledDrag,
  clearEdgeTimer,
  resetDragDwell,
} from "./helper";
import { dragMove } from "./move";
import { getPageStore } from "@/modules/page";
import { getItemStore, type Item } from "@/modules/item";
import { getGridStore, useGridStore } from "@/modules/grid";
import { getActionStore } from "@/modules/action";
import { getRelationStore } from "@/modules/relation";
import { pick } from "@/lib";
import {
  addItemToGroup,
  addItemToGroupAtPoint,
  createGroupFromItems,
} from "@/applications/group";

function restoreDraggedItem(item: Item) {
  if (item.location === "inGroup") {
    addItemToGroupAtPoint(item.id, item);
    return;
  }
  addItemId(item.id, item);
}

function handleGroupWith(dragItem: Item, groupWithId: string) {
  const withItem = getItemStore().items[groupWithId];
  if (!withItem) {
    restoreDraggedItem(dragItem);
    return;
  }

  switch (withItem.type) {
    case "app":
      createGroupFromItems(dragItem, withItem);
      break;
    case "group":
      addItemToGroup(dragItem.id, withItem.id);
      break;
    default:
      restoreDraggedItem(dragItem);
  }
}

async function handleDragEnd() {
  const dragStore = getDragStore();
  const { page } = getPageStore();
  const { updateItem } = getItemStore();
  const { unsetParent } = getRelationStore();

  const { snapshot, ele, current, preview, clear } = dragStore;
  const { target, snap } = current ?? {};
  const { groupWith, transformMap } = preview ?? {};

  try {
    if (!ele || !snapshot || !current) {
      throw new Error("[handleDragEnd] invalid drag state");
    }

    const { item } = snapshot;
    await animateEnd(dragStore, page);

    if (!target || !snap) {
      restoreDraggedItem(item);
      return;
    }

    if (groupWith) {
      handleGroupWith(item, groupWith);
      return;
    }

    if (transformMap) {
      for (const [itemId, point] of Object.entries(transformMap)) {
        updateItem(itemId, { x: point.x, y: point.y });
      }
    }

    if (target.location === "inGroup") {
      addItemToGroupAtPoint(item.id, target);
      getActionStore().addToUndo({
        type: "move",
        itemId: item.id,
        origin: pick(item, ["x", "y", "page", "location"]),
        target,
      });
      return;
    }

    unsetParent(item.id);
    addItemId(item.id, target);
    updateItem(item.id, target);

    const { dockIds } = getGridStore();
    const { items } = getItemStore();
    const shouldSortDock =
      target.location === "dock" ||
      Object.keys(transformMap ?? {}).some(
        (itemId) => items[itemId]?.location === "dock",
      );
    if (shouldSortDock) {
      useGridStore.setState({
        dockIds: [...dockIds].sort((a, b) => items[a].x - items[b].x),
      });
    }

    getActionStore().addToUndo({
      type: "move",
      itemId: item.id,
      origin: pick(item, ["x", "y", "page", "location"]),
      target,
    });
  } catch (error) {
    console.error("[handleDragEnd] error", error);
  } finally {
    clear();
  }
}

export function dragEnd() {
  window.removeEventListener("pointermove", dragMove, { capture: true });
  window.removeEventListener("pointerup", dragEnd, { capture: true });
  window.removeEventListener("pointercancel", dragEnd, { capture: true });

  cancelScheduledDrag();
  clearEdgeTimer();
  resetDragDwell();
  handleDragEnd();
}
