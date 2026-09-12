import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type GroupStore = {
  groupId: string;
};

export const useGroupStore = create<GroupStore>()(
  immer((set) => ({
    groupId: "",
  })),
);

export function getGroupStore() {
  return useGroupStore.getState();
}
