import { getDragStore, type DragCurrent } from "@/modules/drag";
import type { ItemLocation } from "@/modules/item";
import { changePage } from "@/modules/page";

export function handlePageOnEdge(
  prev: DragCurrent | undefined,
  location: ItemLocation,
  isInGroup?: boolean,
) {
  const { setEdgeTimer, edgeTimer } = getDragStore();

  const isEdge = isInGroup
    ? ["groupLeft", "groupRight"].includes(location)
    : ["mainLeft", "mainRight"].includes(location);

  const wasEdge = ["mainLeft", "mainRight", "groupLeft", "groupRight"].includes(
    prev?.target?.location ?? "",
  );

  if (isEdge && !wasEdge) {
    const nextTimer = window.setInterval(() => {
      const isRight = isInGroup
        ? location === "groupRight"
        : location === "mainRight";

      changePage(isRight ? "next" : "prev");
    }, 700);
    setEdgeTimer(nextTimer);
  }

  if (!isEdge && wasEdge) {
    if (edgeTimer !== undefined) {
      clearInterval(edgeTimer);
      setEdgeTimer(undefined);
    }
  }
}

export function clearEdgeTimer() {
  const { edgeTimer, setEdgeTimer } = getDragStore();
  if (edgeTimer === undefined) return;
  clearInterval(edgeTimer);
  setEdgeTimer(undefined);
}
