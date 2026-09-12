import { create } from "zustand";
import type { Layout } from "@/types";

export type LayoutStore = Partial<Layout> & {
  iconSize: number;
  setLayout: (layout: Layout) => void;
};

export const useLayoutStore = create<LayoutStore>()((set) => ({
  iconSize: 60,
  setLayout: (layout) => set(layout),
}));

export function getLayoutStore() {
  return useLayoutStore.getState();
}
