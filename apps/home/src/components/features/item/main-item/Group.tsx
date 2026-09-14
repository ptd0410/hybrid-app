import { useDragStatus, usePickGroupStore, usePreviewChildren } from "@/hooks";
import { cn } from "@/lib";
import { CellWrapper, ItemName, MainIcon } from "../item.ui";
import { Dragable } from "../../drag/dragable/Dragable";
import { GroupContextMenu } from "../context-menu";
import type { WithItem } from "@/types";

export function Group({ item }: WithItem) {
  const { snapshot } = usePickGroupStore("snapshot");
  const children = usePreviewChildren(item.id);
  const { isGroupWith } = useDragStatus(item.id);
  const isExpanded = snapshot?.groupId === item.id;

  return (
    <CellWrapper>
      <GroupContextMenu item={item}>
        <Dragable
          item={item}
          // onClick={(e) => openGroup(itemId, e.currentTarget as HTMLElement)}
        >
          <MainIcon
            className={cn(
              "relative transition-all",
              isExpanded && "invisible",
              isGroupWith && "scale-125",
            )}
          >
            <div className="grid size-full grid-cols-3 grid-rows-3 gap-1 rounded-[inherit] p-1.5 bg-white/30">
              {children.map((child) => (
                <img
                  key={child.id}
                  src={child.icon}
                  className="size-full rounded-sm object-cover"
                  alt=""
                  draggable={false}
                />
              ))}
            </div>
          </MainIcon>
        </Dragable>
      </GroupContextMenu>
      <ItemName>{item.name}</ItemName>
    </CellWrapper>
  );
}
