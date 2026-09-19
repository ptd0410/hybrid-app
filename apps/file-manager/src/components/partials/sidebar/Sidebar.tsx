import { HeaderWrapper } from "@/components/ui";
import type { PropsWithChildren } from "react";
import { Favorites } from "./Favorites";
import { Volumes } from "./Volumes";

export type SidebarProps = PropsWithChildren;

export function Sidebar({ children }: SidebarProps) {
  return (
    <div className="w-52 h-full shrink-0 flex flex-col overflow-hidden bg-white/5">
      <HeaderWrapper>{children}</HeaderWrapper>
      <div className="flex-1 w-full flex flex-col overflow-auto">
        <Favorites />
        <Volumes />
      </div>
    </div>
  );
}
