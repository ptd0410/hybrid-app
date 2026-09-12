import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type RelationStore = {
  parents: Record<string, string>;
  children: Record<string, string[]>;
  setParent: (childId: string, parentId: string) => void;
  setChildren: (itemId: string, childrenIds: string[]) => void;
};

export const useRelationStore = create<RelationStore>()(
  immer((set) => ({
    parents: {},
    children: {},
    setParent: (childId, parentId) =>
      set((s) => {
        s.parents[childId] = parentId;
      }),
    setChildren: (itemId, childrenIds) =>
      set((s) => {
        s.children[itemId] = childrenIds;
      }),
  })),
);

export function getRelationStore() {
  return useRelationStore.getState();
}
