import { clamp } from "@/lib";
import type { DragCurrent, Target } from "@/modules/drag";
import { getPageStore } from "@/modules/page";

export function handlePageOnEdge(
  prev: DragCurrent | undefined,
  currentTarget: Target | undefined,
  isInGroup?: boolean,
) {
  const { location = "null" } = currentTarget ?? {};

  let intervalId = prev?.intervalId;

  const isEdge = isInGroup
    ? ["groupLeft", "groupRight"].includes(location)
    : ["mainLeft", "mainRight"].includes(location);

  const wasEdge = ["mainLeft", "mainRight", "groupLeft", "groupRight"].includes(
    prev?.target?.location ?? "",
  );

  if (isEdge && !wasEdge) {
    intervalId = window.setInterval(() => {
      const { page, total, setPage } = getPageStore();
      const isRight = isInGroup
        ? location === "groupRight"
        : location === "mainRight";

      const next = page + (isRight ? 1 : -1);
      setPage(clamp(next, 0, total));
    }, 700);
  } else if (!isEdge && wasEdge) {
    if (intervalId !== undefined) {
      clearInterval(intervalId);
      intervalId = undefined;
    }
  }

  return intervalId;
}
