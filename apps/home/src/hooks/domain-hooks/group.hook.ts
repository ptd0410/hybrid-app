import { useGroupStore, type GroupStore } from "@/modules/group";
import { useStoreKeys } from "../shared-hooks";
import { useRelationStore } from "@/modules/relation";
import { usePickItemStore } from "./item.hook";
import { useMemo } from "react";
import { usePickLayoutStore } from "./layout.hook";
import { chunk } from "@/lib";

export function usePickGroupStore<K extends keyof GroupStore>(
  ...keys: K[]
): Pick<GroupStore, K> {
  return useStoreKeys(useGroupStore, keys);
}

export function useChildren(groupId: string) {
  const { items } = usePickItemStore("items");
  const ids = useRelationStore((s) => s.children[groupId]);
  const { group } = usePickLayoutStore("group");

  return useMemo(() => {
    const total = group.grid.col * group.grid.row;
    return chunk(ids, total).map((page) => page.map((id) => items[id]));
  }, [group, items, ids]);
}

export function usePreviewChildren(groupId: string) {
  const { items } = usePickItemStore("items");
  const ids = useRelationStore((s) => s.children[groupId]);
  return useMemo(() => {
    return ids.slice(0, 9).map((id) => items[id]);
  }, [items, ids]);
}
