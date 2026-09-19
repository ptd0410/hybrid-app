import { useCallback } from "react";
import { parentPath } from "@/lib";
import { useActiveStore } from "@/modules/active";
import { useHistoryStore } from "@/modules/history";

export function useNavigation() {
  const setRoot = useActiveStore((s) => s.setRoot);
  const index = useHistoryStore((s) => s.index);
  const stack = useHistoryStore((s) => s.stack);
  const historyGoTo = useHistoryStore((s) => s.goTo);
  const historyBack = useHistoryStore((s) => s.back);
  const historyForward = useHistoryStore((s) => s.forward);

  const goTo = useCallback(
    (path: string) => {
      historyGoTo(path);
      setRoot(path);
    },
    [historyGoTo, setRoot],
  );

  const back = useCallback(() => {
    const path = historyBack();
    if (path) setRoot(path);
  }, [historyBack, setRoot]);

  const forward = useCallback(() => {
    const path = historyForward();
    if (path) setRoot(path);
  }, [historyForward, setRoot]);

  const goUp = useCallback(() => {
    const parent = parentPath(useActiveStore.getState().root);
    if (parent) goTo(parent);
  }, [goTo]);

  return {
    goTo,
    back,
    forward,
    goUp,
    canBack: index > 0,
    canForward: index >= 0 && index < stack.length - 1,
  };
}

export function useClickRoot() {
  const { goTo } = useNavigation();
  return goTo;
}
