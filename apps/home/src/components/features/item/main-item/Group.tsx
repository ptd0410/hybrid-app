import {
  useDragStatus,
  useItemChildIds,
  useItemMetadata,
  usePickGroupStore,
  usePickItemStore,
} from "@/hooks";
import { AppOrGroupWrapper, ItemName, MainIcon } from "../ui";
import { Dragable } from "../../Dragable";
import { openGroup } from "@/logic";
import { GroupContextMenu } from "../context-menu";
import { cn } from "@/lib";

export type GroupProps = {
  itemId: string;
};

export function Group({ itemId }: GroupProps) {
  const metadata = useItemMetadata(itemId);
  const { snapshot } = usePickGroupStore("snapshot");
  const childIds = useItemChildIds(itemId);
  const { metadataMap } = usePickItemStore("metadataMap");
  const { isGroupWith } = useDragStatus(itemId);

  const isExpanded = snapshot?.groupId === itemId;

  const children = childIds
    .flat()
    .slice(0, 9)
    .map((id) => metadataMap[id]);

  return (
    <AppOrGroupWrapper>
      <GroupContextMenu itemId={itemId}>
        <Dragable
          itemId={itemId}
          onClick={(e) => openGroup(itemId, e.currentTarget as HTMLElement)}
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
                  src={child.logo}
                  className="size-full rounded-sm object-cover"
                  alt=""
                  draggable={false}
                />
              ))}
            </div>
          </MainIcon>
        </Dragable>
      </GroupContextMenu>
      <ItemName>{metadata.name}</ItemName>
    </AppOrGroupWrapper>
  );
}
