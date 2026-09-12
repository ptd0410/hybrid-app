import type { DragSnapshot } from "@/modules/drag";

export function resolveRollbackPosition(
  snapshot: DragSnapshot,
  currentPage: number,
) {
  const pageDelta = Math.sign(snapshot.item.page - currentPage);
  const position = snapshot.position.origin;
  return {
    left: position.left + pageDelta * window.innerWidth,
    top: position.top,
  };
}
