import { useCallback, useRef } from "react";

const HOLD_THRESHOLD = 300;
const MOVE_THRESHOLD = 5;

type ClickHoldState = {
  pointerId: number | null;
  startX: number;
  startY: number;
  currentTarget: HTMLElement | null;
  holdTimer: ReturnType<typeof setTimeout> | null;
  isHolding: boolean;
  cancelled: boolean;
};

type ClickHoldOptions = {
  onClick?: (event: React.PointerEvent) => void;
  onHold?: (event: React.PointerEvent, currentTarget: HTMLElement) => void;
  holdThreshold?: number;
  moveThreshold?: number;
};

export function useClickHold({
  onClick,
  onHold,
  holdThreshold = HOLD_THRESHOLD,
  moveThreshold = MOVE_THRESHOLD,
}: ClickHoldOptions = {}) {
  const stateRef = useRef<ClickHoldState>({
    pointerId: null,
    startX: 0,
    startY: 0,
    currentTarget: null,
    holdTimer: null,
    isHolding: false,
    cancelled: false,
  });

  const clearTimer = useCallback(() => {
    const state = stateRef.current;

    if (state.holdTimer !== null) {
      clearTimeout(state.holdTimer);
      state.holdTimer = null;
    }
  }, []);

  const cancel = useCallback(() => {
    const state = stateRef.current;

    clearTimer();

    state.pointerId = null;
    state.currentTarget = null;
    state.isHolding = false;
    state.cancelled = true;
  }, [clearTimer]);

  const onPointerDown = useCallback(
    (event: React.PointerEvent) => {
      // Chỉ xử lý primary pointer
      if (!event.isPrimary) return;

      const state = stateRef.current;

      clearTimer();

      state.pointerId = event.pointerId;
      state.startX = event.clientX;
      state.startY = event.clientY;

      // IMPORTANT:
      // Capture currentTarget ngay khi pointerdown còn đang chạy.
      state.currentTarget = event.currentTarget as HTMLElement;

      state.isHolding = false;
      state.cancelled = false;

      state.holdTimer = setTimeout(() => {
        const currentState = stateRef.current;

        if (
          currentState.cancelled ||
          currentState.pointerId !== event.pointerId ||
          !currentState.currentTarget
        ) {
          return;
        }

        currentState.isHolding = true;
        currentState.holdTimer = null;

        onHold?.(event, currentState.currentTarget);
      }, holdThreshold);
    },
    [clearTimer, holdThreshold, onHold],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent) => {
      const state = stateRef.current;

      if (state.pointerId !== event.pointerId || state.cancelled) {
        return;
      }

      const dx = event.clientX - state.startX;
      const dy = event.clientY - state.startY;

      if (Math.hypot(dx, dy) > moveThreshold) {
        cancel();
      }
    },
    [cancel, moveThreshold],
  );

  const onPointerUp = useCallback(
    (event: React.PointerEvent) => {
      const state = stateRef.current;

      if (state.pointerId !== event.pointerId) {
        return;
      }

      const wasHolding = state.isHolding;
      const wasCancelled = state.cancelled;

      clearTimer();

      state.pointerId = null;
      state.currentTarget = null;
      state.isHolding = false;

      if (!wasCancelled && !wasHolding) {
        onClick?.(event);
      }

      state.cancelled = false;
    },
    [clearTimer, onClick],
  );

  const onPointerCancel = useCallback(
    (event: React.PointerEvent) => {
      const state = stateRef.current;

      if (state.pointerId !== event.pointerId) {
        return;
      }

      cancel();
    },
    [cancel],
  );

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
  };
}
