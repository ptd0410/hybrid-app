import { ContextMenuWrapper } from "@/components/custom";
import { type PropsWithChildren } from "react";

export type MainContextMenuProps = PropsWithChildren;

export function MainContextMenu({ children }: MainContextMenuProps) {
  return (
    <ContextMenuWrapper
      children={children}
      items={[
        {
          label: "New folder",
        },
        {
          label: "Create secure group",
        },
        {
          label: "View",
          subs: [
            {
              label: "small",
            },
            {
              label: "medium",
            },
            {
              label: "large",
            },
          ],
        },
        {
          label: "Paste",
        },
        {
          label: "Sort by",
          subs: [
            {
              label: "Name",
            },
            {
              label: "Type",
            },
            {
              label: "Size",
            },
            {
              label: "Modified date",
            },
          ],
        },
        {
          label: "Refresh",
        },

        {
          label: "Display settings",
        },
        {
          label: "Personalize",
        },
        {
          label: "Task Manager",
        },
        {
          label: "Edit",
          subs: [
            {
              label: "Home screen",
            },
            {
              label: "Widgets",
            },
          ],
        },
      ]}
    />
  );
}
