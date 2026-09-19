import type { CSSProperties, ReactNode } from "react";

export function VirtualSpace({
  size,
  horizontal,
  children,
}: {
  size: number;
  horizontal?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={horizontal ? "relative h-full shrink-0" : "relative w-full"}
      style={horizontal ? { width: size } : { height: size }}
    >
      {children}
    </div>
  );
}

export function virtualItemStyle(
  start: number,
  horizontal?: boolean,
): CSSProperties {
  return {
    position: "absolute",
    top: 0,
    left: 0,
    ...(horizontal ? { height: "100%" } : { width: "100%" }),
    transform: horizontal ? `translateX(${start}px)` : `translateY(${start}px)`,
  };
}
