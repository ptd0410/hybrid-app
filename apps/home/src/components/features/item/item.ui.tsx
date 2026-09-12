import { usePickLayoutStore } from "@/hooks";
import { cn } from "@/lib";
import { useDragStore } from "@/modules/drag";
import type { WithClassName, WithItemId } from "@/types";
import { useState, type ComponentProps, type PropsWithChildren } from "react";
import { useShallow } from "zustand/shallow";

export function CellWrapper({
  children,
  className,
}: PropsWithChildren & WithClassName) {
  return (
    <div
      className={cn(
        "size-full flex flex-col justify-center items-center gap-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function MainIcon({
  children,
  className,
  style,
  ref,
  ...props
}: ComponentProps<"div">) {
  const { iconSize } = usePickLayoutStore("iconSize");

  return (
    <div
      ref={ref}
      className={cn("rounded-2xl", className)}
      style={{
        width: iconSize,
        height: iconSize,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function GroupPreview({ itemId }: WithItemId) {
  const { isGroupWith } = useDragStore(
    useShallow((s) => ({
      isGroupWith: s.current?.groupWith === itemId,
    })),
  );

  return (
    <div
      className={cn(
        "bg-white/30 absolute -z-1 inset-0 transition-all rounded-[inherit]",
        isGroupWith && "scale-125",
      )}
    />
  );
}
export function ItemImage(props: { src?: string } & WithClassName) {
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

export function ItemName({
  children,
  className,
}: PropsWithChildren & WithClassName) {
  return (
    <p className={cn("text-sm line-clamp-1 text-center", className)}>
      {children}
    </p>
  );
}
