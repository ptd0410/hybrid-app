import type { Target } from "@/modules/drag";
import { getGridStore } from "@/modules/grid";
import type { Item } from "@/modules/item";
import { getRelationStore } from "@/modules/relation";

export function addItemId(itemId: string, target: Target) {
  const { addMainId, addDockId } = getGridStore();

  switch (target.location) {
    case "main": {
      addMainId(itemId, target.page);
      break;
    }
    case "dock": {
      if (target.x == null) return;
      addDockId(itemId, target.x);
      break;
    }
  }
}

export function removeItemId(item: Item) {
  const { removeChildId, removeMainId, removeDockId } = getGridStore();
  const { parents, removeChild } = getRelationStore();

  const { id, page } = item;

  switch (item.location) {
    case "main":
      removeMainId(id, page);
      break;

    case "dock":
      removeDockId(id);
      break;

    case "inGroup": {
      const groupId = parents[id];
      if (!groupId) return;
      removeChildId(groupId, id, page);
      removeChild(groupId, id);
      break;
    }
  }
}
