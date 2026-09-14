import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type {
  DragCurrent,
  DragDwell,
  DragPhase,
  DragPreview,
  DragSnapshot,
} from "./drag.type";

export type DragStore = {
  ele?: HTMLDivElement | null;
  snapshot?: DragSnapshot;
  current?: DragCurrent;
  preview?: DragPreview;
  phase: DragPhase;

  dwell?: DragDwell;
  raf?: number;
  edgeTimer?: number;

  initEle: (ele: HTMLDivElement | null) => void;
  start: (input: DragSnapshot) => void;
  move: (input: DragCurrent) => void;
  setPreview: (input: DragPreview | undefined) => void;
  clear: () => void;
  setDwell: (dwell: DragDwell | undefined) => void;
  patchDwell: (patch: Partial<DragDwell>) => void;
  setRaf: (raf: number | undefined) => void;
  setEdgeTimer: (input: number | undefined) => void;
};

function clearDwellTimeout(dwell?: DragDwell) {
  if (dwell?.timeoutId === undefined) return;
  clearTimeout(dwell.timeoutId);
}

function clearEdgeTimerId(edgeTimer?: number) {
  if (edgeTimer === undefined) return;
  clearInterval(edgeTimer);
}

export const useDragStore = create<DragStore>()(
  immer((set) => ({
    phase: "idle",
    initEle: (ele) => set({ ele }),
    start: (snapshot) =>
      set((s) => {
        clearDwellTimeout(s.dwell);
        clearEdgeTimerId(s.edgeTimer);
        s.snapshot = snapshot;
        s.phase = "dragging";
        s.current = undefined;
        s.preview = undefined;
        s.dwell = undefined;
        s.edgeTimer = undefined;
      }),
    move: (current) => set({ current }),
    setPreview: (preview) => set({ preview }),
    clear: () =>
      set((s) => {
        clearDwellTimeout(s.dwell);
        clearEdgeTimerId(s.edgeTimer);
        s.phase = "idle";
        s.snapshot = undefined;
        s.current = undefined;
        s.preview = undefined;
        s.dwell = undefined;
        s.edgeTimer = undefined;
      }),
    setDwell: (dwell) =>
      set((s) => {
        if (dwell !== s.dwell) clearDwellTimeout(s.dwell);
        s.dwell = dwell;
      }),
    patchDwell: (patch) =>
      set((s) => {
        if (!s.dwell) return;
        Object.assign(s.dwell, patch);
      }),
    setRaf: (raf) => set({ raf }),
    setEdgeTimer: (edgeTimer) => set({ edgeTimer }),
  })),
);

export function getDragStore() {
  return useDragStore.getState();
}
