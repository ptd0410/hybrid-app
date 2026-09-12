import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { Item } from "./item.type";

export type ItemStore = {
  items: Record<string, Item>;
  initItems: (input: Item[]) => void;
  updateItems: (id: string, input: Partial<Item>) => void;
};

export const useItemStore = create<ItemStore>()(
  immer((set) => ({
    items: {},
    initItems: (input) => {
      set((s) => {
        input.forEach((item) => {
          s.items[item.id] = item;
        });
      });
    },
    updateItems: (id, input) => {
      set((s) => {
        const item = s.items[id];
        if (item) {
          Object.assign(item, input);
        }
      });
    },
  })),
);

export function getItemStore() {
  return useItemStore.getState();
}
