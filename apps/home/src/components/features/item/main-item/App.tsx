import { AppContextMenu } from "../context-menu";
import {
  CellWrapper,
  GroupPreview,
  ItemImage,
  ItemName,
  MainIcon,
} from "../item.ui";
import { Dragable } from "../../drag";
import type { WithItem } from "@/types";

export function App({ item }: WithItem) {
  return (
    <CellWrapper>
      <AppContextMenu item={item}>
        <Dragable item={item}>
          <MainIcon className="relative">
            <GroupPreview item={item} />
            <ItemImage src={item.icon} />
          </MainIcon>
        </Dragable>
      </AppContextMenu>
      <ItemName>{item.name}</ItemName>
    </CellWrapper>
  );
}
