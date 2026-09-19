import { useVirtualizer } from "@tanstack/react-virtual";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type RefObject,
} from "react";

export function useFileVirtualizer(options: {
  parentRef: RefObject<HTMLDivElement | null>;
  count: number;
  estimateSize: number;
  selectedIndex?: number;
  horizontal?: boolean;
  gap?: number;
  overscan?: number;
  getItemKey?: (index: number) => string | number;
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}) {
  const {
    parentRef,
    count,
    estimateSize,
    selectedIndex,
    horizontal,
    gap,
    overscan = 8,
    getItemKey,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = options;
  const getItemKeyRef = useRef(getItemKey);
  getItemKeyRef.current = getItemKey;
  const stableGetItemKey = useCallback(
    (index: number) => getItemKeyRef.current?.(index) ?? index,
    [],
  );

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
    horizontal,
    gap,
    getItemKey: stableGetItemKey,
    enabled: count > 0,
  });

  const lastIndex = virtualizer.getVirtualItems().at(-1)?.index;

  useEffect(() => {
    if (
      lastIndex == null ||
      lastIndex < count - 1 ||
      !hasNextPage ||
      isFetchingNextPage
    ) {
      return;
    }
    fetchNextPage();
  }, [count, fetchNextPage, hasNextPage, isFetchingNextPage, lastIndex]);

  useLayoutEffect(() => {
    if (selectedIndex == null || selectedIndex < 0) return;
    virtualizer.scrollToIndex(selectedIndex, { align: "auto" });
  }, [selectedIndex, virtualizer]);

  return virtualizer;
}
