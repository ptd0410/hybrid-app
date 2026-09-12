import { useItemMetadata } from "@/hooks";
import {
  AppOrGroupWrapper,
  GroupPreview,
  ItemImage,
  ItemName,
  MainIcon,
} from "../ui";
import { DAppContextMenu } from "../context-menu";
import { Dragable } from "../../Dragable";
import { getActionStore } from "@/logic";

export type DAppProps = {
  itemId: string;
};

export function DApp({ itemId }: DAppProps) {
  const metadata = useItemMetadata(itemId);

  return (
    <AppOrGroupWrapper>
      <DAppContextMenu itemId={itemId}>
        <Dragable
          itemId={itemId}
          onClick={() => getActionStore().setSelected(itemId)}
        >
          <MainIcon className="relative">
            <GroupPreview itemId={itemId} />
            <ItemImage src={metadata.logo} />
          </MainIcon>
        </Dragable>
      </DAppContextMenu>

      <ItemName>{metadata.name}</ItemName>
    </AppOrGroupWrapper>
  );
}
