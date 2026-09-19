import { Tag, Text } from "@/components/ui";
import {
  useBrowserDir,
  useFileHotkeys,
  useFileVirtualizer,
  useGridColumns,
} from "@/hooks";
import { cn, moveIndex } from "@/lib";
import { useCallback, useRef, type MouseEvent } from "react";
import { FileContextMenu } from "./FileContextMenu";
import { typeIcon, virtualSize } from "./file.const";
import { FilePager, FileStatus } from "./FileStatus";
import { VirtualSpace, virtualItemStyle } from "./virtual.ui";

export function IconView() {
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
  const columns = useGridColumns(listRef, virtualSize.iconMinWidth);
  const rowCount = items.length ? Math.ceil(items.length / columns) : 0;
  const itemIndex = items.findIndex((item) => item.path === selected.at(-1));
  const virtualizer = useFileVirtualizer({
    parentRef: listRef,
    count: rowCount,
    estimateSize: virtualSize.iconRow,
    gap: virtualSize.iconGap,
    overscan: 4,
    selectedIndex: itemIndex < 0 ? -1 : Math.floor(itemIndex / columns),
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    getItemKey: (index) => items[index * columns]?.path ?? index,
  });

  const getNextIndex = useCallback(
    (key: string, index: number) =>
      moveIndex(key, index, items.length, columns),
    [columns, items.length],
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
      ref={listRef}
      className="flex-1 w-full min-h-0 overflow-auto select-none p-3"
      onClick={() => setSelected([])}
    >
      <FileStatus
        isLoading={isLoading}
        error={error}
        empty={!isLoading && items.length === 0}
      />
      <VirtualSpace size={virtualizer.getTotalSize()}>
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const start = virtualRow.index * columns;
          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              className="grid gap-1"
              style={{
                ...virtualItemStyle(virtualRow.start),
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              }}
            >
              {items.slice(start, start + columns).map((entry) => {
                const isSelected = selected.includes(entry.path);
                return (
                  <FileContextMenu
                    key={entry.path}
                    entry={entry}
                    data-path={entry.path}
                    className={cn(
                      "flex flex-col items-center gap-1.5 px-2 py-2 rounded-md min-w-0",
                      isSelected ? "bg-blue-500/35" : "hover:bg-white/10",
                    )}
                    onClick={(event: MouseEvent<HTMLButtonElement>) => {
                      event.stopPropagation();
                      handleSelect(entry, event);
                    }}
                    onDoubleClick={(event) => {
                      event.stopPropagation();
                      handleOpen(entry);
                    }}
                  >
                    <Tag
                      name={typeIcon[entry.type]}
                      size={40}
                      className="shrink-0 text-white/85"
                    />
                    <Text className="text-xs text-center line-clamp-2 w-full break-all">
                      {entry.name}
                    </Text>
                  </FileContextMenu>
                );
              })}
            </div>
          );
        })}
      </VirtualSpace>
      <FilePager isFetchingNextPage={isFetchingNextPage} />
    </div>
  );
}
