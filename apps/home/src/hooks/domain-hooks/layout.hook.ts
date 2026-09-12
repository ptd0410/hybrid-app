import {
  useLayoutStore,
  type DockLayout,
  type LayoutStore,
  type MainLayout,
} from "@/modules/layout";
import { useStoreKeys } from "../shared-hooks";
import { useMemo } from "react";

export function usePickLayoutStore<K extends keyof LayoutStore>(...keys: K[]) {
  return useStoreKeys(useLayoutStore, keys, { required: true }) as Pick<
    Required<LayoutStore>,
    K
  >;
}

export function useMainStyle(main: MainLayout, dock: DockLayout) {
  return useMemo(
    () => ({
      paddingTop: main.statusbarHeight,
      paddingBottom: main.paginationHeight + dock.size.height,
      paddingLeft: main.paddingX,
      paddingRight: main.paddingX,
    }),
    [main],
  );
}
