import { pick } from "@/lib";
import { addItemId } from "@/applications/drag/helper/item-management";
import { getGridStore } from "@/modules/grid";
import { getItemStore } from "@/modules/item";
import { getRelationStore } from "@/modules/relation";

export function dissolveGroupIfSingleChild(groupId: string) {
  const { childrenIdsMap, removeMainId, removeDockId, removeGroupChildren } =
    getGridStore();
  const { items, updateItem, removeItem } = getItemStore();
  const { clearGroup } = getRelationStore();

  const remaining = childrenIdsMap[groupId]?.flat() ?? [];
  if (remaining.length !== 1) return false;

  const group = items[groupId];
  if (!group) return false;

  const childId = remaining[0];
  const point = pick(group, ["x", "y", "page", "location"]);

  switch (group.location) {
    case "main":
      removeMainId(groupId, group.page);
      break;
    case "dock":
      removeDockId(groupId);
      break;
  }

  updateItem(childId, point);
  addItemId(childId, point);
  removeGroupChildren(groupId);
  clearGroup(groupId);
  removeItem(groupId);
  return true;
}
