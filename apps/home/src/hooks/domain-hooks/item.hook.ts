import { useActionStore } from "@/modules/action";
import { useDragStore } from "@/modules/drag";
import { useItemStore, type Item, type ItemStore } from "@/modules/item";
import { useShallow } from "zustand/shallow";
import { useStoreKeys } from "../shared-hooks";
import { is2DArray } from "@/lib";
import { useMemo } from "react";

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

export function useItems(ids: string[]): Item[];
export function useItems(ids: string[][]): Item[][];

export function useItems(ids: string[] | string[][]) {
  const { items } = usePickItemStore("items");

  return useMemo(
    () =>
      is2DArray(ids)
        ? ids.map((page) => page.map((id) => items[id]))
        : ids.map((id) => items[id]),
    [items, ids],
  );
}
