import {
  useDragStore,
  type DragCurrent,
  type DragSnapshot,
  type DragStore,
} from "@/modules/drag";
import { useStoreKeys } from "../shared-hooks";
import { useShallow } from "zustand/shallow";

export function usePickDragStore<K extends keyof DragStore>(
  ...keys: K[]
): Pick<DragStore, K> {
  return useStoreKeys(useDragStore, keys);
}

export function usePickDragCurreht<K extends keyof DragCurrent>(
  ...keys: K[]
): Pick<DragCurrent, K> {
  return useStoreKeys(useDragStore, keys, {
    selector: (s) => s.current as DragCurrent,
  });
}

export function usePickDragSnapshot<K extends keyof DragSnapshot>(
  ...keys: K[]
): Pick<DragSnapshot, K> {
  return useStoreKeys(useDragStore, keys, {
    selector: (s) => s.snapshot as DragSnapshot,
  });
}

export function useDragStatus(itemId: string) {
  return useDragStore(
    useShallow((s) => ({
      isGroupWith: s.current?.groupWith === itemId,
    })),
  );
}
