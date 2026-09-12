import { useDragStore, type DragCurrent } from "@/modules/drag";
import { useStoreKeys } from "../shared-hooks";
import { useShallow } from "zustand/shallow";

export function usePickDragCurreht<K extends keyof DragCurrent>(
  ...keys: K[]
): Pick<DragCurrent, K> {
  return useStoreKeys(useDragStore, keys, {
    selector: (s) => s.current as DragCurrent,
  });
}

export function useDragStatus(itemId: string) {
  return useDragStore(
    useShallow((s) => ({
      isGroupWith: s.current?.groupWith === itemId,
    })),
  );
}
