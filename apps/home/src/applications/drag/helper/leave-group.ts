import type { Target } from "@/modules/drag";
import { getGroupStore } from "@/modules/group";
import { getRelationStore } from "@/modules/relation";
import {
  arrangeGroupFromChild,
  dissolveGroupIfSingleChild,
} from "@/applications/group";

export function handleLeaveOpenGroup(
  itemId: string,
  prev: Target | undefined,
  next: Target | undefined,
) {
  if (prev?.location !== "inGroup" || next?.location === "inGroup") return;

  const groupId = getRelationStore().parents[itemId];
  if (!groupId) return;
  if (!dissolveGroupIfSingleChild(groupId)) {
    arrangeGroupFromChild(itemId);
  }
  getGroupStore().close();
}
