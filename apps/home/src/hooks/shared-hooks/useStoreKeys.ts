import type { ExtractState, UseBoundStore } from "zustand";
import { useShallow } from "zustand/shallow";

type StoreApiLike = {
  getState: () => object;
  getInitialState: () => object;
  subscribe: (
    listener: (state: unknown, prevState: unknown) => void,
  ) => () => void;
};

export type StoreKeyOptions<State, Selected = State> = {
  required?: boolean;
  selector?: (state: State) => Selected;
};

export function useStoreKeys<
  TApi extends StoreApiLike,
  K extends keyof ExtractState<TApi>,
>(
  store: UseBoundStore<TApi>,
  keys: K[],
  options?: { required?: boolean },
): Pick<ExtractState<TApi>, K>;

export function useStoreKeys<
  TApi extends StoreApiLike,
  TSelected,
  K extends keyof TSelected,
>(
  store: UseBoundStore<TApi>,
  keys: K[],
  options: {
    required?: boolean;
    selector: (state: ExtractState<TApi>) => TSelected;
  },
): Pick<TSelected, K>;

export function useStoreKeys(
  store: UseBoundStore<StoreApiLike>,
  keys: PropertyKey[],
  options: StoreKeyOptions<object> = {},
) {
  const { required, selector } = options;

  return store(
    useShallow((state) => {
      const source = selector ? selector(state) : state;
      const result: Record<PropertyKey, unknown> = {};

      for (const key of keys) {
        const value = source?.[key as keyof typeof source];
        if (value === undefined && required) {
          throw new Error(`${String(key)} is required`);
        }
        result[key] = value;
      }

      return result;
    }),
  );
}
