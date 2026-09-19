import { isFsContainer } from "@/api/fs";
import { Popover, PopoverContent, PopoverTrigger, Tag } from "@/components/ui";
import { fileActions, useActiveTarget, useFileActions } from "@/hooks";
import { cn } from "@/lib";
import { useState, type ReactNode } from "react";

export function FileActionMenu() {
  const { clipboard, open } = useFileActions();
  const { entry, isCurrentFolder, multi, root } = useActiveTarget();
  const [menuOpen, setMenuOpen] = useState(false);
  const canPaste = Boolean(clipboard?.paths.length);
  const isFolder = entry ? isFsContainer(entry.type) : false;
  const hasTarget = Boolean(entry ?? root);

  function run(action: () => void) {
    action();
    setMenuOpen(false);
  }

  return (
    <Popover open={menuOpen} onOpenChange={setMenuOpen}>
      <PopoverTrigger
        title="Actions"
        className={cn(
          "h-7 px-1.5 flex items-center justify-center rounded hover:bg-white/10",
          menuOpen && "bg-white/15",
        )}
      >
        <Tag name="Ellipsis" size={15} />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={6}
        className="w-48 gap-0.5 p-1 bg-[#2c2c35] text-white ring-white/10"
      >
        {isFolder && (
          <MenuRow
            disabled={!hasTarget}
            shortcut="⇧⌘N"
            onClick={() =>
              run(() => fileActions.newFolder(isCurrentFolder ? undefined : entry?.path))
            }
          >
            New Folder
          </MenuRow>
        )}
        {isFolder && !isCurrentFolder && entry && (
          <MenuRow shortcut="↵" onClick={() => run(() => open(entry))}>
            Open
          </MenuRow>
        )}
        <MenuRow
          disabled={!hasTarget}
          shortcut="⌘I"
          onClick={() => run(() => fileActions.getInfo(isCurrentFolder ? undefined : entry))}
        >
          Get Info
        </MenuRow>
        <MenuSep />
        {!isCurrentFolder && (
          <>
            <MenuRow
              disabled={!entry || multi}
              shortcut="F2"
              onClick={() => entry && run(() => fileActions.startRename(entry))}
            >
              Rename
            </MenuRow>
            <MenuRow
              disabled={!entry}
              shortcut="⌘D"
              onClick={() => run(() => fileActions.duplicate(entry))}
            >
              Duplicate
            </MenuRow>
            <MenuSep />
            <MenuRow
              disabled={!entry}
              shortcut="⌘C"
              onClick={() => run(() => fileActions.copy(entry))}
            >
              Copy
            </MenuRow>
            <MenuRow
              disabled={!entry}
              shortcut="⌘X"
              onClick={() => run(() => fileActions.cut(entry))}
            >
              Cut
            </MenuRow>
          </>
        )}
        <MenuRow
          disabled={!canPaste || !hasTarget}
          shortcut="⌘V"
          onClick={() => run(() => fileActions.paste())}
        >
          Paste
        </MenuRow>
        <MenuRow
          disabled={!hasTarget}
          onClick={() => run(() => void fileActions.copyPath(entry))}
        >
          Copy Path
        </MenuRow>
        <MenuSep />
        <MenuRow
          destructive
          disabled={isCurrentFolder || !entry}
          shortcut="⌘⌫"
          onClick={() => run(() => fileActions.remove(entry))}
        >
          Delete
        </MenuRow>
      </PopoverContent>
    </Popover>
  );
}

function MenuRow({
  children,
  shortcut,
  disabled,
  destructive,
  onClick,
}: {
  children: ReactNode;
  shortcut?: string;
  disabled?: boolean;
  destructive?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        "flex w-full items-center rounded px-2 py-1.5 text-left text-sm disabled:opacity-40 disabled:hover:bg-transparent",
        destructive ? "text-red-400 hover:bg-red-500/15" : "hover:bg-white/10",
      )}
      onClick={onClick}
    >
      <span className="flex-1">{children}</span>
      {shortcut && <span className="text-[10px] text-white/40">{shortcut}</span>}
    </button>
  );
}

function MenuSep() {
  return <div className="my-1 h-px bg-white/10" />;
}
