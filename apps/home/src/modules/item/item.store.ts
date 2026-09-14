import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { Item } from "./item.type";

export type ItemStore = {
  items: Record<string, Item>;
  initItems: (input: Item[]) => void;
  setItem: (input: Item) => void;
  updateItem: (id: string, input: Partial<Item>) => void;
  removeItem: (id: string) => void;
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
    setItem: (item) =>
      set((s) => {
        s.items[item.id] = item;
      }),
    updateItem: (id, input) => {
      set((s) => {
        const item = s.items[id];
        if (item) {
          Object.assign(item, input);
        }
      });
    },
    removeItem: (id) =>
      set((s) => {
        delete s.items[id];
      }),
  })),
);

export function getItemStore() {
  return useItemStore.getState();
}
