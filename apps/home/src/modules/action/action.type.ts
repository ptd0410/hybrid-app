import type { Target } from "../drag";

export type ActionType = "copy" | "cut" | "";

export type Action = {
  type: ActionType;
  itemId: string;
};

export type HistoryActionType = "copy" | "move";

export type HistoryAction = {
  type: HistoryActionType;
  itemId: string;
  page?: number;
  origin?: Target;
  target?: Target;
};
