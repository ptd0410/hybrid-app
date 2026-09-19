import { create } from "zustand";

export type HistoryStore = {
  stack: string[];
  index: number;
  goTo: (path: string) => void;
  back: () => string | undefined;
  forward: () => string | undefined;
  clear: () => void;
};

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  stack: [],
  index: -1,
  goTo: (path) =>
    set((state) => {
      if (state.stack[state.index] === path) return state;
      const stack = [...state.stack.slice(0, state.index + 1), path];
      return { stack, index: stack.length - 1 };
    }),
  back: () => {
    const { stack, index } = get();
    if (index <= 0) return undefined;
    const next = index - 1;
    set({ index: next });
    return stack[next];
  },
  forward: () => {
    const { stack, index } = get();
    if (index < 0 || index >= stack.length - 1) return undefined;
    const next = index + 1;
    set({ index: next });
    return stack[next];
  },
  clear: () => set({ stack: [], index: -1 }),
}));
