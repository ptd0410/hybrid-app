import { useStoreKeys } from "../shared-hooks";
import { useInfoStore, type InfoStore } from "@/modules/info";

export function usePickInfoStore<K extends keyof InfoStore>(
  ...keys: K[]
): Pick<InfoStore, K> {
  return useStoreKeys(useInfoStore, keys);
}
