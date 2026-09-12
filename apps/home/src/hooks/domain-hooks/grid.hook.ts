import { useGridStore, type GridStore } from "@/modules/grid";
import { useStoreKeys } from "../shared-hooks";

export function usePickGridStore<K extends keyof GridStore>(
  ...keys: K[]
): Pick<GridStore, K> {
  return useStoreKeys(useGridStore, keys);
}
