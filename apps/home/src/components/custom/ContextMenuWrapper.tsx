import { usePickInfoStore } from "@/hooks";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "../ui";
import type { PropsWithChildren } from "react";

export type IContextMenuItem = {
  label: string;
  onClick?: () => void;
  subs?: Omit<IContextMenuItem, "subs">[];
  hide?: boolean;
  disabled?: boolean;
};

export type ContextMenuWrapperProps = PropsWithChildren & {
  items: IContextMenuItem[];
  blur?: boolean;
};

function Wrapper({ children, blur }: PropsWithChildren & { blur?: boolean }) {
  return (
    <>
      {blur && (
        <div className="absolute inset-0 rounded-[inherit] backdrop-blur-2xl z-[-1]" />
      )}
      {children}
    </>
  );
}

function CustomContextMenuItem({ item }: { item: IContextMenuItem }) {
  if (item.hide) return null;
  return (
    <ContextMenuItem
      disabled={item.disabled}
      // className={cn(item.disabled && "opacity-50 pointer-events-none")}
      onClick={item.onClick}
    >
      {item.label}
    </ContextMenuItem>
  );
}

export function ContextMenuWrapper({
  children,
  items,
  blur = true,
}: ContextMenuWrapperProps) {
  const { device } = usePickInfoStore("device");

  if (device !== "desktop") return children;
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="bg-white/30  border-0 text-white">
        <Wrapper blur={blur}>
          {items.map((item, i) => {
            if (item.hide) return null;

            if (item.subs) {
              return (
                <ContextMenuSub key={i}>
                  <ContextMenuSubTrigger>{item.label}</ContextMenuSubTrigger>
                  <ContextMenuSubContent className="bg-white/30">
                    <Wrapper blur={blur}>
                      {item.subs.map((subItem, j) => (
                        <CustomContextMenuItem key={j} item={subItem} />
                      ))}
                    </Wrapper>
                  </ContextMenuSubContent>
                </ContextMenuSub>
              );
            }
            return <CustomContextMenuItem key={i} item={item} />;
          })}
        </Wrapper>
      </ContextMenuContent>
    </ContextMenu>
  );
}
