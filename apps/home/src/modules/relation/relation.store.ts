import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type RelationStore = {
  parents: Record<string, string>;
  children: Record<string, string[]>;
  setParent: (childId: string, parentId: string) => void;
  unsetParent: (childId: string) => void;
  setChildren: (itemId: string, childrenIds: string[]) => void;
  addChild: (groupId: string, childId: string) => void;
  removeChild: (groupId: string, childId: string) => void;
  clearGroup: (groupId: string) => void;
};

export const useRelationStore = create<RelationStore>()(
  immer((set) => ({
    parents: {},
    children: {},
    setParent: (childId, parentId) =>
      set((s) => {
        s.parents[childId] = parentId;
      }),
    unsetParent: (childId) =>
      set((s) => {
        delete s.parents[childId];
      }),
    setChildren: (itemId, childrenIds) =>
      set((s) => {
        s.children[itemId] = childrenIds;
      }),
    addChild: (groupId, childId) =>
      set((s) => {
        s.parents[childId] = groupId;
        const list = s.children[groupId] ?? [];
        if (!list.includes(childId)) list.push(childId);
        s.children[groupId] = list;
      }),
    removeChild: (groupId, childId) =>
      set((s) => {
        s.children[groupId] = (s.children[groupId] ?? []).filter(
          (id) => id !== childId,
        );
      }),
    clearGroup: (groupId) =>
      set((s) => {
        Object.keys(s.parents).forEach((id) => {
          if (s.parents[id] === groupId) delete s.parents[id];
        });
        delete s.children[groupId];
      }),
  })),
);

export function getRelationStore() {
  return useRelationStore.getState();
}
