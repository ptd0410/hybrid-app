import { ContextMenuWrapper } from "@/components/custom";
import type { WithItem } from "@/types";
import type { PropsWithChildren } from "react";

export function GroupContextMenu({
  children,
  item,
}: PropsWithChildren & WithItem) {
  return (
    <ContextMenuWrapper
      children={children}
      items={[
        {
          label: "Rename",
        },
        {
          label: "Remove",
        },
      ]}
    />
  );
}
