import { getDragStore } from "@/modules/drag";

export function scheduleDrag(cb: () => void) {
  const { raf, setRaf } = getDragStore();
  if (raf !== undefined) {
    cancelAnimationFrame(raf);
  }
  setRaf(
    requestAnimationFrame(() => {
      setRaf(undefined);
      cb();
    }),
  );
}

export function cancelScheduledDrag() {
  const { raf, setRaf } = getDragStore();
  if (raf === undefined) return;
  cancelAnimationFrame(raf);
  setRaf(undefined);
}
