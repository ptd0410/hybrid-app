import { useItem } from "@/hooks";
import { AppContextMenu } from "../context-menu";
import {
  CellWrapper,
  GroupPreview,
  ItemImage,
  ItemName,
  MainIcon,
} from "../item.ui";
import { Dragable } from "../../drag";

export type AppProps = {
  itemId: string;
};

export function App({ itemId }: AppProps) {
  const item = useItem(itemId);

  return (
    <CellWrapper>
      <AppContextMenu itemId={itemId}>
        <Dragable itemId={itemId}>
          <MainIcon className="relative">
            <GroupPreview itemId={itemId} />
            <ItemImage src={item.icon} />
          </MainIcon>
        </Dragable>
      </AppContextMenu>
      <ItemName>{item.name}</ItemName>
    </CellWrapper>
  );
}
