import { DockIcon, ItemImage } from "../item.ui";

export type TrashProps = {};

export function Trash({}: TrashProps) {
  return (
    <DockIcon>
      <ItemImage src="https://i.pinimg.com/736x/e6/01/a6/e601a64a7641116fc5ca47dc5479874f.jpg" />
    </DockIcon>
  );
}
