import { getDragStore, type DragDwell } from "@/modules/drag";
import { getItemStore } from "@/modules/item";
import type { ClientPoint } from "@/types";
import { resolveHoverKind } from "./collision";
import { displaceOtherItems } from "./displace";

export const DWELL_MOVE_PX = 6;
export const PUSH_DWELL_MS = 50;

export function resetDragDwell() {
  getDragStore().setDwell(undefined);
}

function commitPushDwell(itemId: string) {
  const { dwell, patchDwell, snapshot, current, phase, setPreview } =
    getDragStore();
  if (!dwell || dwell.itemId !== itemId) return;
  patchDwell({ committed: true });

  if (phase !== "dragging" || !snapshot || !current) return;

  const { items } = getItemStore();
  const kind = resolveHoverKind(
    current.target.location,
    current.colliedItems,
    items,
    current.clientPoint,
    snapshot.layout,
  );
  const hoverId = current.colliedItems[0]?.itemId;
  if (kind !== "push" || hoverId !== dwell.itemId) {
    resetDragDwell();
    setPreview({ transformMap: undefined });
    return;
  }

  setPreview({
    groupWith: undefined,
    transformMap: displaceOtherItems(
      current.target.location,
      current.colliedItems,
      current.direction,
      current.clientPoint,
      snapshot,
      items,
    ),
  });
}

export function armPushDwell(itemId: string, origin: ClientPoint) {
  resetDragDwell();
  const timeoutId = window.setTimeout(() => {
    commitPushDwell(itemId);
  }, PUSH_DWELL_MS);
  getDragStore().setDwell({ itemId, origin, timeoutId, committed: false });
}

export function shouldRearmPushDwell(
  dwell: DragDwell | undefined,
  hoverId: string,
  pointer: ClientPoint,
) {
  const sameTarget = dwell?.itemId === hoverId;
  const drifted =
    !dwell ||
    Math.hypot(
      pointer.clientX - dwell.origin.clientX,
      pointer.clientY - dwell.origin.clientY,
    ) > DWELL_MOVE_PX;
  return !sameTarget || drifted;
}
