import { handleDragStart } from "@/applications";
import { cn } from "@/lib";
import { Slot } from "@radix-ui/react-slot";
import type { ComponentProps, PointerEvent, PropsWithChildren } from "react";
import { useClickHold } from "./useClickHold";

export type DragableProps = PropsWithChildren &
  Omit<ComponentProps<typeof Slot>, "onClick"> & {
    onDragStart?: () => void;
    onClick?: (event: PointerEvent) => void;
    itemId: string;
  };

export function Dragable({
  children,
  onClick,
  className,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  itemId,
  ...props
}: DragableProps) {
  const behavior = useClickHold({
    onHold: (e, currentTarget) => {
      handleDragStart(e, children, currentTarget, itemId);
    },
    onClick,
  });

  return (
    <Slot
      {...props}
      className={cn("swiper-no-swiping touch-none", className)}
      onPointerDown={(event) => {
        console.log("thandhuy down");
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
