import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { GridIds } from "./grid.type";

export type GridStore = GridIds & {
  initIds: (input: Partial<GridIds>) => void;
};

export const useGridStore = create<GridStore>()(
  immer((set) => ({
    mainIds: [],
    dockIds: [],
    recentAppIds: [],
    recentWindowIds: [],
    initIds: (input) => set(input),
  })),
);

export function getGridStore() {
  return useGridStore.getState();
}
