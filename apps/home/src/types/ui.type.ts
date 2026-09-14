import type { Item } from "@/modules/item";

export type WithClassName = {
  className?: string;
};

export type WithItemId = {
  itemId: string;
};

export type WithItem = {
  item: Item;
};
