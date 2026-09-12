import type { DragSnapshot, Target } from "@/modules/drag";

export function computeIconSize(snapshot: DragSnapshot, target?: Target) {
  const { layout } = snapshot;
  if (!target) return undefined;
  switch (target.location) {
    case "main":
      return layout.main.iconSize;
    case "inGroup":
      return layout.group.iconSize;
    case "dock":
      return layout.dock.iconSize;
  }
}
