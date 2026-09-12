import { getDragStore, type DragCurrent } from "@/modules/drag";
import { getGroupStore } from "@/modules/group";
import { getItemStore } from "@/modules/item";
import { getPageStore } from "@/modules/page";
import {
  computeDirection,
  computePoint,
  detectLocation,
  handlePageOnEdge,
  scheduleDrag,
} from "./helper";
import { pick } from "@/lib";
import { updateElementPosition } from "./drag.shared";

export function dragMove(e: PointerEvent) {
  scheduleDrag(() => {
    const { snapshot, ele, current: prev, phase, move } = getDragStore();
    const { page } = getPageStore();
    const { groupId } = getGroupStore();
    const { items } = getItemStore();

    if (phase !== "dragging") return;
    if (!snapshot || !ele) return;

    const { layout, position } = snapshot;
    const { dock } = layout;

    const clientPoint = pick(e, ["clientX", "clientY"]);
    const location = detectLocation(clientPoint, snapshot.layout);
    const point = computePoint(clientPoint, location, layout);
    const target = location && point ? { ...point, location, page } : undefined;
    const intervalId = handlePageOnEdge(prev, target, !!groupId);
    const left = clientPoint.clientX - position.offset.left;
    const top = clientPoint.clientY - position.offset.top;
    const dockBound = location === "dock" ? dock.boundIn : dock.boundOut;
    const direction = computeDirection(clientPoint, prev);

    const current: DragCurrent = {
      clientPoint,
      target,
      intervalId,
      dockBound,
      direction,
    };

    updateElementPosition(ele, left, top);
    move(current);
  });
}
