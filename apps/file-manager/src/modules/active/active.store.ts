import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { DisplayMode, SortKey } from "./active.type";

export type ActiveStore = {
  root: string;
  selected: string[];
  display: DisplayMode;
  sortBy: SortKey;
  setRoot: (root: string) => void;
  setSelected: (selected: string[]) => void;
  setDisplay: (display: DisplayMode) => void;
  setSortBy: (sortBy: SortKey) => void;
};

export const useActiveStore = create<ActiveStore>()(
  immer((set) => ({
    root: "",
    selected: [],
    display: "list",
    sortBy: "name",
    setRoot: (root) => set({ root, selected: [] }),
    setSelected: (selected) => set({ selected }),
    setDisplay: (display) => set({ display }),
    setSortBy: (sortBy) => set({ sortBy }),
  })),
);

export function getActiveStore() {
  return useActiveStore.getState();
}
