import { create } from "zustand";
import type { Layout } from "@/types";

export type PageStore = Partial<Layout> & {
  page: number;
  total: number;
  setPage: (input: number) => void;
  setTotal: (input: number) => void;
};

export const usePageStore = create<PageStore>()((set) => ({
  page: 0,
  total: 0,
  setPage: (page) => set({ page }),
  setTotal: (total) => set({ total }),
}));

export function getPageStore() {
  return usePageStore.getState();
}
