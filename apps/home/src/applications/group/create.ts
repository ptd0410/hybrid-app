import type { Item } from "@/modules/item";
import { getGridStore } from "@/modules/grid";
import { getItemStore } from "@/modules/item";
import { getRelationStore } from "@/modules/relation";
import { addItemId } from "@/applications/drag/helper/item-management";
import { arrangeGroup, writeGroupChildren } from "./arrange";

let groupCounter = Date.now();

function generateGroupId() {
  return `5_${groupCounter++}`;
}

export function createGroupFromItems(dragItem: Item, withItem: Item) {
  const { setItem, updateItem } = getItemStore();
  const { removeMainId, removeDockId } = getGridStore();
  const { setParent } = getRelationStore();

  const groupId = generateGroupId();
  const group: Item = {
    id: groupId,
    name: "",
    icon: "",
    type: "group",
    x: withItem.x,
    y: withItem.y,
    page: withItem.page,
    location: withItem.location,
    col: withItem.col,
    row: withItem.row,
  };

  setItem(group);

  switch (withItem.location) {
    case "main":
      removeMainId(withItem.id, withItem.page);
      break;
    case "dock":
      removeDockId(withItem.id);
      break;
  }

  const childIds = [withItem.id, dragItem.id];
  childIds.forEach((id) => {
    setParent(id, groupId);
    updateItem(id, { location: "inGroup" });
  });
  writeGroupChildren(groupId, [childIds]);
  addItemId(groupId, withItem);
  arrangeGroup(groupId);
}
