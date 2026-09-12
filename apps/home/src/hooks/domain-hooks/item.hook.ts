import { useActionStore } from "@/modules/action";
import { useDragStore } from "@/modules/drag";
import { useItemStore, type ItemStore } from "@/modules/item";
import { useShallow } from "zustand/shallow";
import { useStoreKeys } from "../shared-hooks";

export function usePickItemStore<K extends keyof ItemStore>(
  ...keys: K[]
): Pick<ItemStore, K> {
  return useStoreKeys(useItemStore, keys);
}

export function useItem(itemId: string) {
  return useItemStore((s) => s.items[itemId]);
}

export function useItemStatus(itemId: string) {
  const dragStatus = useDragStore(
    useShallow((s) => ({
      selfDrag: s.snapshot?.item.id === itemId,
      dargging: s.phase === "dragging",
    })),
  );
  const actionStatus = useActionStore(
    useShallow((s) => ({
      isCut: s.active?.type === "cut" && s.active.itemId === itemId,
      isSelected: s.selected.includes(itemId),
    })),
  );

  return { ...dragStatus, ...actionStatus };
}
