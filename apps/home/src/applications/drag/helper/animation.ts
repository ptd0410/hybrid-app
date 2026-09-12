import type { Position } from "@/types";
import { animate } from "framer-motion";

export type AnimationOptions = Position & {
  size: number;
};

export function animateTransform(
  ele: HTMLElement,
  from: AnimationOptions,
  to: AnimationOptions,
) {
  const scaleTo = from.size > 0 ? to.size / from.size : 1;
  ele.style.transformOrigin = "0 0";

  return new Promise<void>((resolve) => {
    animate(
      ele,
      {
        x: [from.left, to.left],
        y: [from.top, to.top],
        scale: [1, scaleTo],
      },
      {
        type: "spring",
        stiffness: 500,
        damping: 38,
        mass: 0.8,
        onComplete: resolve,
      },
    );
  });
}
