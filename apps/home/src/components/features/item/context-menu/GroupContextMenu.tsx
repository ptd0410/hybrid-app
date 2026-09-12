import { ContextMenuWrapper } from "@/components/custom";
import type { WithItemId } from "@/types";
import type { PropsWithChildren } from "react";

export function GroupContextMenu({
  children,
  itemId,
}: PropsWithChildren & WithItemId) {
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
