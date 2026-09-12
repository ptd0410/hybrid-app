import { create } from "zustand";
import type { GroupSnapshot, GroupPhase } from "./group.type";

export type GroupStore = {
  snapshot?: GroupSnapshot;
  phase: GroupPhase;
  open: (input: GroupSnapshot) => void;
  close: () => void;
  setPhase: (phase: GroupPhase) => void;
};

export const useGroupStore = create<GroupStore>()((set) => ({
  openId: "",
  phase: "close",
  open: (snapshot) => set({ snapshot, phase: "opening" }),
  close: () => set({ snapshot: undefined, phase: "close" }),
  setPhase: (phase) => set({ phase }),
}));

export function getGroupStore() {
  return useGroupStore.getState();
}
