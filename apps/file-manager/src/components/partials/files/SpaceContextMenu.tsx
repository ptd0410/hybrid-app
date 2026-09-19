import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui";
import { fileActions, useFileActions } from "@/hooks";
import { useActiveStore, type DisplayMode, type SortKey } from "@/modules/active";
import type { ReactNode } from "react";
import { DISPLAY_MODES, SORT_OPTIONS } from "./file.const";

const itemClass = "focus:bg-white/15 focus:text-white data-open:bg-white/15 data-open:text-white";
const menuClass = "min-w-44 bg-[#2c2c36] text-white ring-white/10";

export function SpaceContextMenu({ children }: { children: ReactNode }) {
  const { clipboard } = useFileActions();
  const root = useActiveStore((s) => s.root);
  const display = useActiveStore((s) => s.display);
  const sortBy = useActiveStore((s) => s.sortBy);
  const setSelected = useActiveStore((s) => s.setSelected);
  const setDisplay = useActiveStore((s) => s.setDisplay);
  const setSortBy = useActiveStore((s) => s.setSortBy);
  const canPaste = Boolean(clipboard?.paths.length);

  return (
    <ContextMenu
      onOpenChange={(open) => {
        if (open) setSelected([]);
      }}
    >
      <ContextMenuTrigger className="flex-1 min-h-0 w-full flex flex-col overflow-hidden">
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent
        side="bottom"
        align="start"
        className={menuClass}
      >
        <ContextMenuItem
          className={itemClass}
          disabled={!root}
          onClick={() => fileActions.newFolder()}
        >
          New Folder
          <ContextMenuShortcut className="text-white/40">⇧⌘N</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem
          className={itemClass}
          disabled={!root}
          onClick={() => fileActions.getInfo()}
        >
          Get Info
          <ContextMenuShortcut className="text-white/40">⌘I</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator className="bg-white/10" />
        <ContextMenuSub>
          <ContextMenuSubTrigger className={itemClass}>View</ContextMenuSubTrigger>
          <ContextMenuSubContent className={menuClass}>
            <ContextMenuRadioGroup
              value={display}
              onValueChange={(value) => setDisplay(value as DisplayMode)}
            >
              {DISPLAY_MODES.map((mode) => (
                <ContextMenuRadioItem
                  key={mode.id}
                  value={mode.id}
                  closeOnClick
                  className={itemClass}
                >
                  {mode.label}
                </ContextMenuRadioItem>
              ))}
            </ContextMenuRadioGroup>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSub>
          <ContextMenuSubTrigger className={itemClass}>Sort By</ContextMenuSubTrigger>
          <ContextMenuSubContent className={menuClass}>
            <ContextMenuRadioGroup
              value={sortBy}
              onValueChange={(value) => setSortBy(value as SortKey)}
            >
              {SORT_OPTIONS.map((option) => (
                <ContextMenuRadioItem
                  key={option.id}
                  value={option.id}
                  closeOnClick
                  className={itemClass}
                >
                  {option.label}
                </ContextMenuRadioItem>
              ))}
            </ContextMenuRadioGroup>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator className="bg-white/10" />
        <ContextMenuItem
          className={itemClass}
          disabled={!canPaste || !root}
          onClick={() => fileActions.paste()}
        >
          Paste
          <ContextMenuShortcut className="text-white/40">⌘V</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
