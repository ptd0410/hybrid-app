import { dragEnd } from "./end";
import { dragMove } from "./move";
import { dragStart } from "./start";

export const drag = {
  start: dragStart,
  move: dragMove,
  end: dragEnd,
};
