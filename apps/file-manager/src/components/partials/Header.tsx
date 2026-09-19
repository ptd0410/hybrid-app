import { basename } from "@/lib";
import { useNavigation } from "@/hooks";
import { useActiveStore } from "@/modules/active";
import { HeaderWrapper, Separator, Tag, Text } from "../ui";
import { DisplaySwitch } from "./DisplaySwitch";
import { FileActionMenu } from "./FileActionMenu";
import { SortSwitch } from "./SortSwitch";

export type HeaderProps = {};

export function Header({}: HeaderProps) {
  const root = useActiveStore((s) => s.root);
  const { back, forward, canBack, canForward } = useNavigation();

  return (
    <div className="flex flex-col shrink-0">
      <HeaderWrapper>
        <div className="flex items-center gap-1 px-2 min-w-0 flex-1">
          <button
            type="button"
            title="Back"
            className="size-7 flex items-center justify-center rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
            disabled={!canBack}
            onClick={back}
          >
            <Tag name="ChevronLeft" />
          </button>
          <button
            type="button"
            title="Forward"
            className="size-7 flex items-center justify-center rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
            disabled={!canForward}
            onClick={forward}
          >
            <Tag name="ChevronRight" />
          </button>
          <div className="flex items-center gap-2 ml-2 min-w-0">
            <Tag name="Folder" className="shrink-0" />
            <Text className="truncate">{root ? basename(root) : ""}</Text>
          </div>
        </div>
        <div className="flex items-center gap-0.5 px-2 shrink-0">
          <DisplaySwitch />
          <SortSwitch />
          <FileActionMenu />
        </div>
      </HeaderWrapper>
      <Separator className="bg-white/10" />
    </div>
  );
}
