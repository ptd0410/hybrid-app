import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { GridIds } from "./grid.type";

export type GridStore = GridIds & {
  initIds: (input: Partial<GridIds>) => void;
  addMainId: (itemId: string, page: number) => void;
  removeMainId: (id: string, page: number) => void;
  addDockId: (itemId: string, x: number) => void;
  removeDockId: (id: string) => void;
  addChildId: (groupId: string, itemId: string, page: number) => void;
  removeChildId: (groupId: string, itemId: string, page: number) => void;
  setChildPages: (groupId: string, pages: string[][]) => void;
  removeGroupChildren: (groupId: string) => void;
};

export const useGridStore = create<GridStore>()(
  immer((set) => ({
    mainIds: [],
    dockIds: [],
    recentAppIds: [],
    recentWindowIds: [],
    childrenIdsMap: {},
    initIds: (input) => set(input),
    addMainId: (id, page) =>
      set((s) => {
        s.mainIds[page] ??= [];
        s.mainIds[page].push(id);
      }),
    removeMainId: (itemId, page) =>
      set((s) => {
        s.mainIds[page] = s.mainIds[page].filter((id) => id !== itemId);
      }),
    addDockId: (itemId, index) =>
      set((s) => {
        s.dockIds.splice(index, 0, itemId);
      }),
    removeDockId: (itemId) =>
      set((s) => {
        s.dockIds = s.dockIds.filter((id) => id !== itemId);
      }),
    addChildId: (groupId, itemId, page) => {
      set((s) => {
        s.childrenIdsMap[groupId] ??= [];
        s.childrenIdsMap[groupId][page] ??= [];
        s.childrenIdsMap[groupId][page].push(itemId);
      });
    },
    removeChildId: (groupId, itemId, page) =>
      set((s) => {
        if (!s.childrenIdsMap[groupId]) return;
        s.childrenIdsMap[groupId][page] =
          s.childrenIdsMap[groupId][page]?.filter((id) => id !== itemId) ?? [];
      }),
    setChildPages: (groupId, pages) =>
      set((s) => {
        s.childrenIdsMap[groupId] = pages;
      }),
    removeGroupChildren: (groupId) =>
      set((s) => {
        delete s.childrenIdsMap[groupId];
      }),
  })),
);

export function getGridStore() {
  return useGridStore.getState();
}
