import { cn } from "@/lib";
import type { PropsWithChildren } from "react";

type TextProps = PropsWithChildren<{ className?: string }>;

export function Text({ children, className }: TextProps) {
  return <p className={cn("text-sm", className)}>{children}</p>;
}

export function Desc({ children, className }: TextProps) {
  return <p className={cn("text-xs", className)}>{children}</p>;
}

export function SmallLabel({ children, className }: TextProps) {
  return <p className={cn("text-xs font-bold", className)}>{children}</p>;
}
