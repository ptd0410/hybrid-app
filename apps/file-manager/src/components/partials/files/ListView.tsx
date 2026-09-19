import { Tag, Text } from "@/components/ui";
import { useBrowserDir, useFileHotkeys, useFileVirtualizer } from "@/hooks";
import { cn, moveIndex } from "@/lib";
import { useCallback, useRef, type MouseEvent } from "react";
import { FileContextMenu } from "./FileContextMenu";
import { kindLabel, typeIcon, virtualSize } from "./file.const";
import { FilePager, FileStatus } from "./FileStatus";
import { VirtualSpace, virtualItemStyle } from "./virtual.ui";

export function ListView() {
  const {
    items,
    selected,
    setSelected,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    handleSelect,
    handleOpen,
  } = useBrowserDir();
  const listRef = useRef<HTMLDivElement>(null);
  const selectedIndex = items.findIndex(
    (item) => item.path === selected.at(-1),
  );
  const virtualizer = useFileVirtualizer({
    parentRef: listRef,
    count: items.length,
    estimateSize: virtualSize.listRow,
    selectedIndex,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    getItemKey: (index) => items[index]?.path ?? index,
  });

  const getNextIndex = useCallback(
    (key: string, index: number) => {
      if (key !== "ArrowUp" && key !== "ArrowDown") return undefined;
      return moveIndex(key, index, items.length);
    },
    [items.length],
  );
  useFileHotkeys({
    items,
    selected,
    setSelected,
    onOpen: handleOpen,
    getNextIndex,
  });

  return (
    <div
      className="flex-1 w-full min-h-0 flex flex-col select-none"
      onClick={() => setSelected([])}
    >
      <div className="shrink-0 z-10 flex items-center px-3 py-1 text-xs text-white/45 bg-[#212129] border-b border-white/10">
        <span className="flex-1">Name</span>
        <span className="w-24">Kind</span>
      </div>
      <div ref={listRef} className="flex-1 min-h-0 overflow-auto">
        <FileStatus
          isLoading={isLoading}
          error={error}
          empty={!isLoading && items.length === 0}
        />
        <VirtualSpace size={virtualizer.getTotalSize()}>
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const entry = items[virtualItem.index];
            if (!entry) return null;
            const isSelected = selected.includes(entry.path);
            return (
              <FileContextMenu
                key={virtualItem.key}
                entry={entry}
                data-index={virtualItem.index}
                data-path={entry.path}
                ref={virtualizer.measureElement}
                className={cn(
                  "flex items-center gap-2 px-3 py-1 text-left",
                  isSelected ? "bg-blue-500/35" : "hover:bg-white/10",
                )}
                style={virtualItemStyle(virtualItem.start)}
                onClick={(event: MouseEvent<HTMLButtonElement>) => {
                  event.stopPropagation();
                  handleSelect(entry, event);
                }}
                onDoubleClick={(event) => {
                  event.stopPropagation();
                  handleOpen(entry);
                }}
              >
                <Tag name={typeIcon[entry.type]} className="shrink-0" />
                <Text className="flex-1 truncate">{entry.name}</Text>
                <Text className="w-24 text-white/45">
                  {kindLabel[entry.type]}
                </Text>
              </FileContextMenu>
            );
          })}
        </VirtualSpace>
        <FilePager isFetchingNextPage={isFetchingNextPage} />
      </div>
    </div>
  );
}
