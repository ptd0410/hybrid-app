import { isFsContainer, type FileEntry } from "@/api/fs";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui";
import {
  fileActions,
  fileDropOverClass,
  useFileActions,
  useFileDrag,
  useFolderDrop,
} from "@/hooks";
import { cn, parentPath } from "@/lib";
import { useActiveStore } from "@/modules/active";
import {
  forwardRef,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";

export type FileContextMenuProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  entry: FileEntry;
  children: ReactNode;
};

export const FileContextMenu = forwardRef<
  HTMLButtonElement,
  FileContextMenuProps
>(function FileContextMenu(
  {
    entry,
    children,
    className,
    onContextMenu,
    onClick,
    onDoubleClick,
    ...props
  },
  ref,
) {
  const { open, clipboard } = useFileActions();
  const selected = useActiveStore((s) => s.selected);
  const setSelected = useActiveStore((s) => s.setSelected);
  const { isDragging, dragProps } = useFileDrag(entry);
  const isFolder = isFsContainer(entry.type);
  const { isOver, dropProps } = useFolderDrop(isFolder ? entry.path : undefined);
  const multi = selected.includes(entry.path) && selected.length > 1;
  const canPaste = Boolean(clipboard?.paths.length);
  const destDir = parentPath(entry.path);
  const itemClass = "focus:bg-white/15 focus:text-white";

  function handleContextMenu(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    if (!selected.includes(entry.path)) setSelected([entry.path]);
    onContextMenu?.(event);
  }

  return (
    <ContextMenu
      onOpenChange={(next) => {
        if (next && !useActiveStore.getState().selected.includes(entry.path)) {
          setSelected([entry.path]);
        }
      }}
    >
      <ContextMenuTrigger
        ref={ref}
        render={
          <button
            type="button"
            {...props}
            {...dragProps}
            {...(isFolder ? dropProps : {})}
            className={cn(
              className,
              isDragging && "opacity-50",
              isOver && fileDropOverClass,
            )}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            onContextMenu={handleContextMenu}
          />
        }
      >
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent
        side="bottom"
        align="start"
        className="min-w-44 bg-[#2c2c36] text-white ring-white/10"
      >
        {isFsContainer(entry.type) && (
          <ContextMenuItem
            className={itemClass}
            onClick={() => open(entry)}
          >
            Open
            <ContextMenuShortcut className="text-white/40">
              ↵
            </ContextMenuShortcut>
          </ContextMenuItem>
        )}
        <ContextMenuItem
          className={itemClass}
          onClick={() => fileActions.getInfo(entry)}
        >
          Get Info
          <ContextMenuShortcut className="text-white/40">⌘I</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator className="bg-white/10" />
        <ContextMenuItem
          className={itemClass}
          disabled={multi}
          onClick={() => fileActions.startRename(entry)}
        >
          Rename
          <ContextMenuShortcut className="text-white/40">F2</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem
          className={itemClass}
          onClick={() => fileActions.duplicate(entry)}
        >
          Duplicate
          <ContextMenuShortcut className="text-white/40">⌘D</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator className="bg-white/10" />
        <ContextMenuItem
          className={itemClass}
          onClick={() => fileActions.copy(entry)}
        >
          Copy
          <ContextMenuShortcut className="text-white/40">⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem
          className={itemClass}
          onClick={() => fileActions.cut(entry)}
        >
          Cut
          <ContextMenuShortcut className="text-white/40">⌘X</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem
          className={itemClass}
          disabled={!canPaste}
          onClick={() => fileActions.paste(destDir)}
        >
          Paste
          <ContextMenuShortcut className="text-white/40">⌘V</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem
          className={itemClass}
          onClick={() => void fileActions.copyPath(entry)}
        >
          Copy Path
        </ContextMenuItem>
        <ContextMenuSeparator className="bg-white/10" />
        <ContextMenuItem
          variant="destructive"
          onClick={() => fileActions.remove(entry)}
        >
          Delete
          <ContextMenuShortcut className="text-white/40 group-focus/context-menu-item:text-destructive">
            ⌘⌫
          </ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
});

FileContextMenu.displayName = "FileContextMenu";
