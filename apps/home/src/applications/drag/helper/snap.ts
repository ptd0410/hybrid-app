import type { LayoutSnapshot, Snap, Target } from "@/modules/drag";

export function computeSnapPosition(
  targetPoint: Target | undefined,
  layout: LayoutSnapshot,
): Snap | undefined {
  if (!targetPoint) return;
  const { x, y, location } = targetPoint;
  const { dock, main, group, iconSize } = layout;

  if (x == null || y == null) return;

  switch (location) {
    case "main": {
      const { cell } = main;
      const { width, height } = cell;
      const insetX = (width - iconSize) / 2;
      const insetY = (height - iconSize - 12 - 14) / 2;
      return {
        left: x * width + main.paddingX + insetX,
        top: y * height + main.statusbarHeight + insetY,
        iconSize,
      };
    }
    case "dock": {
      const { boundIn, iconSize } = dock;
      const cell = iconSize + dock.gap;
      return {
        left: boundIn.left + dock.paddingX + x * cell,
        top: boundIn.top + dock.paddingY,
        iconSize: dock.iconSize,
      };
    }
    case "inGroup": {
      const { width, height } = group.size;
      const { left, top } = group.bound;

      const gap = Math.min(12, height * 0.05);
      const nameH = 14;
      const insetX = (width - iconSize) / 2;
      const insetY = (height - iconSize - gap - nameH) / 2;
      return {
        left: left + group.paddingX + x * width + insetX,
        top: top + group.paddingY + y * height + insetY,
        iconSize,
      };
    }
  }
}
