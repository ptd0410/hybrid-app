import { create } from "zustand";
import type { Action, HistoryAction } from "./action.type";
import { immer } from "zustand/middleware/immer";

export type ActionStore = {
  active?: Action;
  undoStack: HistoryAction[];
  redoStack: HistoryAction[];
  selected: string[];
  setActive: (input: Action) => void;
  updateActive: (input: Partial<Action>) => void;
  addToUndo: (input: HistoryAction) => string[];
  undo: () => void;
  redo: () => void;
  setSelected: (input: string | string[]) => void;
};

export const useActionStore = create<ActionStore>()(
  immer((set, get) => ({
    undoStack: [],
    redoStack: [],
    selected: [],
    setActive: (action: Action) => set({ active: action }),
    updateActive: (input: Partial<Action>) =>
      set((state) => {
        if (state.active) {
          Object.assign(state.active, input);
        }
      }),
    addToUndo: (input) => {
      const redoItemIds = get().redoStack.map((action) => action.itemId);

      set((state) => {
        state.undoStack.push(input);
        state.redoStack = [];
      });
      return redoItemIds;
    },
    undo: () =>
      set((state) => {
        const action = state.undoStack.pop();

        if (action) {
          state.redoStack.push(action);
        }
      }),
    redo: () =>
      set((state) => {
        const action = state.redoStack.pop();

        if (action) {
          state.undoStack.push(action);
        }
      }),
    setSelected: (input) =>
      set({ selected: Array.isArray(input) ? input : [input] }),
  })),
);

export function getActionStore() {
  return useActionStore.getState();
}
