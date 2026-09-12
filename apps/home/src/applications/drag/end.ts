import { getDragStore } from "@/modules/drag";
import { cancelScheduledDrag, clearEdgeInterval } from "./helper";
import { dragMove } from "./move";

async function handleDragEnd() {
  const { snapshot, ele, current, clear } = getDragStore();

  if (!ele) throw new Error("[handleDragEnd] invalid drag state");

  try {
    if (!snapshot || !current?.target)
      throw new Error("[handleDragEnd] invalid drag state");

    const fromSize = ele.getBoundingClientRect().width;
  } catch (error) {
    console.error("[handleDragEnd] error", error);
  } finally {
    clear();
  }
}

export function dragEnd() {
  window.removeEventListener("pointermove", dragMove, { capture: true });
  window.removeEventListener("pointerup", dragEnd, { capture: true });
  window.removeEventListener("pointercancel", dragEnd, { capture: true });

  cancelScheduledDrag();
  clearEdgeInterval();
  handleDragEnd();
}
