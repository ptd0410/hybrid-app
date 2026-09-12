import { usePageStore, type PageStore } from "@/modules/page";
import { useStoreKeys } from "../shared-hooks";

export function usePickPageStore<K extends keyof PageStore>(
  ...keys: K[]
): Pick<PageStore, K> {
  return useStoreKeys(usePageStore, keys);
}
