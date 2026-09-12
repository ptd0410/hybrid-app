import type { ExtractState, UseBoundStore } from "zustand";
import { useShallow } from "zustand/shallow";

type StoreApiLike = {
  getState: () => object;
  getInitialState: () => object;
  subscribe: (
    listener: (state: unknown, prevState: unknown) => void,
  ) => () => void;
};

export type StoreKeyOptions = {
  required?: boolean;
};

export function useStoreKeys<
  TApi extends StoreApiLike,
  K extends keyof ExtractState<TApi>,
>(
  store: UseBoundStore<TApi>,
  keys: K[],
  options: StoreKeyOptions = {},
): Pick<ExtractState<TApi>, K> {
  const { required } = options;

  return store(
    useShallow((state) => {
      const result = {} as Pick<ExtractState<TApi>, K>;

      for (const key of keys) {
        const value = state[key];
        if (value === undefined && required) {
          throw new Error(`${String(key)} is required`);
        }
        result[key] = value;
      }

      return result;
    }),
  );
}
