import { cn } from "@/lib";
import { Slot } from "@radix-ui/react-slot";
import type { ComponentProps, PointerEvent, PropsWithChildren } from "react";
import { useClickHold } from "./useClickHold";
import { drag } from "@/applications";
import type { WithItem } from "@/types";

export type DragableProps = PropsWithChildren &
  WithItem &
  Omit<ComponentProps<typeof Slot>, "onClick"> & {
    onDragStart?: () => void;
    onClick?: (event: PointerEvent) => void;
  };

export function Dragable({
  children,
  onClick,
  className,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  item,
  ...props
}: DragableProps) {
  const behavior = useClickHold({
    onHold: (e, currentTarget) => {
      drag.start(e, children, currentTarget, item.id);
    },
    onClick,
  });

  return (
    <Slot
      {...props}
      className={cn("swiper-no-swiping touch-none", className)}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        behavior.onPointerDown(event);
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        behavior.onPointerMove(event);
      }}
      onPointerUp={(event) => {
        onPointerUp?.(event);
        behavior.onPointerUp(event);
      }}
      onPointerCancel={(event) => {
        onPointerCancel?.(event);
        behavior.onPointerCancel(event);
      }}
    >
      {children}
    </Slot>
  );
}
