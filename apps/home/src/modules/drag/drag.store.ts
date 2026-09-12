import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { DragCurrent, DragPhase, DragSnapshot } from "./drag.type";

export type DragStore = {
  ele?: HTMLDivElement | null;
  snapshot?: DragSnapshot;
  current?: DragCurrent;
  phase: DragPhase;
  raf?: number;
  initEle: (ele: HTMLDivElement | null) => void;
  start: (input: DragSnapshot) => void;
  move: (input: DragCurrent) => void;
  clear: () => void;
  setRaf: (raf: number | undefined) => void;
};

export const useDragStore = create<DragStore>()(
  immer((set) => ({
    phase: "idle",
    initEle: (ele) => set({ ele }),
    start: (snapshot) =>
      set({ snapshot, phase: "dragging", current: undefined }),
    move: (current) => set({ current }),
    clear: () =>
      set({ phase: "idle", snapshot: undefined, current: undefined }),
    setRaf: (raf) => set({ raf }),
  })),
);

export function getDragStore() {
  return useDragStore.getState();
}
