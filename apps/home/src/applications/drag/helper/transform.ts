import type {
  DragSnapshot,
  DragStore,
  LayoutSnapshot,
  Snap,
} from "@/modules/drag";
import type { ItemLocation } from "@/modules/item";
import { animate } from "framer-motion";

export function updateElementPosition(
  element: HTMLElement,
  x: number,
  y: number,
) {
  Object.assign(element.style, {
    left: "0px",
    top: "0px",
    transform: `translate(${x}px, ${y}px)`,
  });
}

export function animateTransform(ele: HTMLElement, from: Snap, to: Snap) {
  const scaleTo = from.iconSize > 0 ? to.iconSize / from.iconSize : 1;
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

function getIconSize(
  location: ItemLocation | undefined,
  layout: LayoutSnapshot,
) {
  return location === "dock" ? layout.dock.iconSize : layout.iconSize;
}

function resolveRollbackSnap(
  snapshot: DragSnapshot,
  currentPage: number,
): Snap {
  const pageDelta = Math.sign(snapshot.item.page - currentPage);
  const position = snapshot.position.origin;
  return {
    left: position.left + pageDelta * window.innerWidth,
    top: position.top,
    iconSize: getIconSize(snapshot.item.location, snapshot.layout),
  };
}

export async function animateEnd(store: DragStore, currentPage: number) {
  const { snapshot, ele, current } = store;

  if (!ele || !snapshot || !current)
    throw new Error("[animateEnd] Invalid state");

  const { layout, position } = snapshot;
  const { clientPoint } = current;
  const { offset } = position;

  const from: Snap = {
    iconSize: getIconSize(current.target?.location, layout),
    left: clientPoint.clientX - offset.left,
    top: clientPoint.clientY - offset.top,
  };

  const to = current?.snap ?? resolveRollbackSnap(snapshot, currentPage);

  await animateTransform(ele, from, to);
  return;
}
