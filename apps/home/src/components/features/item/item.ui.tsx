import { Image, type ImageProps } from "@/components/ui";
import { usePickLayoutStore } from "@/hooks";
import { cn } from "@/lib";
import { useDragStore } from "@/modules/drag";
import type { WithClassName, WithItem } from "@/types";
import { type ComponentProps, type PropsWithChildren } from "react";
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

export function GroupPreview({ item }: WithItem) {
  const { isGroupWith } = useDragStore(
    useShallow((s) => ({
      isGroupWith: s.preview?.groupWith === item.id,
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
export function ItemImage(props: ImageProps) {
  return <Image {...props} />;
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

export function DockIcon({
  children,
  className,
  style,
  ref,
  ...props
}: ComponentProps<"div">) {
  const { dock } = usePickLayoutStore("dock");
  const { iconSize } = dock;

  return (
    <div
      ref={ref}
      className={cn("rounded-2xl size-10", className)}
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
