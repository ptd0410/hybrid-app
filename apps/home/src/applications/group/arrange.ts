import { chunk } from "@/lib";
import { getGridStore } from "@/modules/grid";
import { getItemStore } from "@/modules/item";
import { getLayoutStore } from "@/modules/layout";
import { getRelationStore } from "@/modules/relation";
import type { GridSize } from "@/types";

export function writeGroupChildren(groupId: string, pages: string[][]) {
  const { setChildPages } = getGridStore();
  const { setChildren } = getRelationStore();
  setChildPages(groupId, pages);
  setChildren(groupId, pages.flat());
}

export function getGridPosition(index: number, gridSize: GridSize) {
  const { col, row } = gridSize;
  const pageSize = col * row;
  const page = Math.floor(index / pageSize);
  const pageIdx = index % pageSize;
  const x = pageIdx % col;
  const y = Math.floor(pageIdx / col);
  return { page, x, y };
}

export function arrangeGroup(groupId: string) {
  const { childrenIdsMap } = getGridStore();
  const { updateItem } = getItemStore();
  const { group } = getLayoutStore();
  if (!group) return;

  const { grid } = group;
  const childIds = childrenIdsMap[groupId]?.flat() ?? [];
  childIds.forEach((id, i) => {
    updateItem(id, { ...getGridPosition(i, grid), location: "inGroup" });
  });
  writeGroupChildren(groupId, chunk(childIds, grid.col * grid.row));
}

export function arrangeGroupFromChild(itemId: string) {
  const groupId = getRelationStore().parents[itemId];
  if (!groupId) return;
  arrangeGroup(groupId);
}
