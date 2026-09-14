import { cn } from "@/lib";
import type { WithClassName } from "@/types";
import { useState } from "react";

export type ImageProps = { src?: string } & WithClassName;

export function Image(props: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      className={cn(
        "size-full rounded-[inherit] object-cover",
        !loaded && "bg-slate-300 animate-pulse",
        props.className,
      )}
      src={props.src || undefined}
      draggable={false}
      onLoad={() => setLoaded(true)}
    />
  );
}
