import { Desc, Tag, Text } from "@/components/ui";
import { useBrowserDir, useFileHotkeys, useFileVirtualizer } from "@/hooks";
import { cn, moveIndex, selectedEntry } from "@/lib";
import { useCallback, useEffect, useRef, type MouseEvent } from "react";
import { FileContextMenu } from "./FileContextMenu";
import { kindLabel, typeIcon, virtualSize } from "./file.const";
import { FilePager, FileStatus } from "./FileStatus";
import { VirtualSpace, virtualItemStyle } from "./virtual.ui";

export function GalleryView() {
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
  const current = selectedEntry(items, selected);
  const selectedIndex = items.findIndex(
    (item) => item.path === selected.at(-1),
  );
  const virtualizer = useFileVirtualizer({
    parentRef: listRef,
    count: items.length,
    estimateSize: virtualSize.galleryItem,
    gap: virtualSize.galleryGap,
    horizontal: true,
    selectedIndex,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    getItemKey: (index) => items[index]?.path ?? index,
  });

  useEffect(() => {
    if (selected.length || !items[0]) return;
    setSelected([items[0].path]);
  }, [items, selected.length, setSelected]);

  const getNextIndex = useCallback(
    (key: string, index: number) => {
      const mapped =
        key === "ArrowUp"
          ? "ArrowLeft"
          : key === "ArrowDown"
            ? "ArrowRight"
            : key;
      if (mapped !== "ArrowLeft" && mapped !== "ArrowRight") return undefined;
      return moveIndex(mapped, index, items.length);
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
    <div className="flex-1 w-full min-h-0 flex flex-col overflow-hidden select-none">
      <div className="flex-1 min-h-0 flex items-center justify-center px-6">
        {current ? (
          <div className="flex flex-col items-center gap-3 max-w-md">
            <Tag
              name={typeIcon[current.type]}
              size={88}
              className="text-white/80"
            />
            <Text className="text-center break-all">{current.name}</Text>
            <Desc className="text-white/45">{kindLabel[current.type]}</Desc>
          </div>
        ) : isLoading || error || items.length === 0 ? (
          <FileStatus
            isLoading={isLoading}
            error={error}
            empty={!isLoading && items.length === 0}
          />
        ) : (
          <Text className="text-white/45">Select an item to preview</Text>
        )}
      </div>
      <div
        ref={listRef}
        className="h-28 shrink-0 flex items-stretch overflow-x-auto border-t border-white/10 px-2 py-2"
      >
        <VirtualSpace size={virtualizer.getTotalSize()} horizontal>
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
                  "w-20 flex flex-col items-center justify-center gap-1 rounded-md px-1",
                  isSelected ? "bg-blue-500/35" : "hover:bg-white/10",
                )}
                style={virtualItemStyle(virtualItem.start, true)}
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
                  size={28}
                  className="shrink-0 text-white/85"
                />
                <Text className="text-[10px] leading-tight text-center truncate w-full">
                  {entry.name}
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
