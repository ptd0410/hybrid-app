import type { Target } from "@/modules/drag";
import { getGridStore } from "@/modules/grid";
import { getGroupStore } from "@/modules/group";
import { getItemStore } from "@/modules/item";
import { getRelationStore } from "@/modules/relation";
import { arrangeGroup, writeGroupChildren } from "./arrange";

export function addItemToGroup(draggedItemId: string, groupId: string) {
  const { childrenIdsMap, addChildId } = getGridStore();
  const { updateItem } = getItemStore();
  const { setParent } = getRelationStore();

  const pages = childrenIdsMap[groupId] ?? [[]];
  const lastPage = Math.max(0, pages.length - 1);
  addChildId(groupId, draggedItemId, lastPage);
  setParent(draggedItemId, groupId);
  updateItem(draggedItemId, { location: "inGroup" });
  arrangeGroup(groupId);
}

export function addItemToGroupAtPoint(itemId: string, target: Target) {
  const { childrenIdsMap } = getGridStore();
  const { updateItem } = getItemStore();
  const { parents, setParent } = getRelationStore();
  const groupId = getGroupStore().snapshot?.groupId ?? parents[itemId];
  if (!groupId || target.x == null || target.y == null) return;

  setParent(itemId, groupId);
  updateItem(itemId, {
    x: target.x,
    y: target.y,
    page: target.page,
    location: "inGroup",
  });

  const pages = (childrenIdsMap[groupId] ?? [[]]).map((ids) =>
    ids.filter((id) => id !== itemId),
  );
  while (pages.length <= target.page) pages.push([]);
  pages[target.page].push(itemId);
  writeGroupChildren(groupId, pages);
}
