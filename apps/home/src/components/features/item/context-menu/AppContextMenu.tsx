import { ContextMenuWrapper } from "@/components/custom";
import type { WithItem } from "@/types";
import type { PropsWithChildren } from "react";

export type AppContextMenuProps = PropsWithChildren &
  WithItem & {
    isDock?: boolean;
  };

export function AppContextMenu({
  item,
  isDock,
  children,
}: AppContextMenuProps) {
  return (
    <ContextMenuWrapper
      children={children}
      items={[
        {
          label: "Create secure app",
        },
        {
          label: "Copy",
        },
        {
          label: "Move",
        },
        {
          label: "Share",
          disabled: true,
        },
        {
          label: "Open",
        },
        {
          label: "Run as administrator",
        },
        {
          label: "Rename",
        },
        {
          label: "Duplicate",
        },
        {
          label: "Delete",
        },
        {
          label: "Remove from dock",
          hide: !isDock,
        },
        {
          label: "Show in finder",
          disabled: true,
        },
      ]}
    />
  );
}
