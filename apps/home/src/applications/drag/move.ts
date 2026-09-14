import { getDragStore, type DragCurrent } from "@/modules/drag";
import { getGroupStore } from "@/modules/group";
import { getItemStore } from "@/modules/item";
import { getPageStore } from "@/modules/page";
import {
  armPushDwell,
  computeDirection,
  computePoint,
  computeSnapPosition,
  detectLocation,
  getColliedItems,
  handleLeaveOpenGroup,
  handlePageOnEdge,
  resetDragDwell,
  resolveDragInteraction,
  scheduleDrag,
  updateElementPosition,
} from "./helper";
import { pick } from "@/lib";

export function dragMove(e: PointerEvent) {
  scheduleDrag(() => {
    const {
      snapshot,
      ele,
      current: prev,
      preview,
      phase,
      dwell,
      move,
      setPreview,
    } = getDragStore();
    const { page } = getPageStore();
    const { snapshot: groupSnapshot } = getGroupStore();
    const { items } = getItemStore();

    if (phase !== "dragging") return;
    if (!snapshot || !ele) return;

    const { layout, position, item } = snapshot;
    const { dock } = layout;

    const clientPoint = pick(e, ["clientX", "clientY"]);
    const location = detectLocation(clientPoint, layout, {
      prev: prev?.target,
      isGroupOpen: !!groupSnapshot,
    });
    const point = computePoint(clientPoint, location, layout);
    const targetPage =
      location === "inGroup"
        ? item.location === "inGroup"
          ? item.page
          : 0
        : page;
    const target = { location, page: targetPage, ...point };
    const left = clientPoint.clientX - position.offset.left;
    const top = clientPoint.clientY - position.offset.top;
    const dockBound = location === "dock" ? dock.boundIn : dock.boundOut;
    const direction = computeDirection(clientPoint, prev);
    const snap = computeSnapPosition(target, layout);
    const colliedItems = getColliedItems(snapshot, target);
    handleLeaveOpenGroup(item.id, prev?.target, target);
    const interaction = resolveDragInteraction({
      location,
      target,
      colliedItems,
      clientPoint,
      snapshot,
      items,
      direction,
      prev,
      preview,
      dwell,
    });

    if (interaction.dwellAction === "reset") resetDragDwell();
    if (interaction.dwellAction === "arm" && interaction.hoverId) {
      armPushDwell(interaction.hoverId, clientPoint);
    }

    const current: DragCurrent = {
      clientPoint,
      target,
      dockBound,
      direction,
      snap,
      colliedItems,
    };

    handlePageOnEdge(prev, location, !!groupSnapshot);
    updateElementPosition(ele, left, top);
    move(current);
    setPreview({
      groupWith: interaction.groupWith,
      transformMap: interaction.transformMap,
    });
  });
}
