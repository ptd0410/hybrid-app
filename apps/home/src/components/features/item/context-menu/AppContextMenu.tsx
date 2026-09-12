import { ContextMenuWrapper } from "@/components/custom";
import type { PropsWithChildren } from "react";

export type AppContextMenuProps = PropsWithChildren & {
  itemId: string;
  isDock?: boolean;
};

export function AppContextMenu({
  itemId,
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
