import { SmallLabel, Tag, Text, type IconName } from "@/components/ui";
import {
  fileActions,
  fileDropOverClass,
  useFavoriteDrop,
  useFolderDrop,
} from "@/hooks";
import { cn } from "@/lib";
import type { Div } from "@/types";
import type { MouseEvent } from "react";

export type ISidebarItem = {
  id: string;
  label: string;
  icon?: IconName;
  href?: string;
};

export type SidebarSectionProps = {
  items: ISidebarItem[];
  label: string;
  activeId?: string;
  pinFavorites?: boolean;
  extraIds?: string[];
  onSelect?: (item: ISidebarItem) => void;
};

export type SidebarItemProps = Div & {
  item: ISidebarItem;
  active?: boolean;
};

export function SidebarItem({
  item,
  active,
  className,
  ...props
}: SidebarItemProps) {
  const { isOver, dropProps } = useFolderDrop(item.id);

  return (
    <div
      className={cn(
        "flex items-center gap-2 cursor-pointer rounded px-2 py-1",
        active && "bg-white/15",
        isOver && fileDropOverClass,
        className,
      )}
      {...props}
      {...dropProps}
    >
      {item.icon && <Tag name={item.icon} className="shrink-0" />}
      <Text className="truncate">{item.label}</Text>
    </div>
  );
}

export function SidebarSection({
  items,
  label,
  activeId,
  pinFavorites,
  extraIds,
  onSelect,
}: SidebarSectionProps) {
  const pin = useFavoriteDrop();
  const extras = extraIds ?? [];

  function handleItemContextMenu(
    event: MouseEvent<HTMLDivElement>,
    item: ISidebarItem,
  ) {
    if (!extras.includes(item.id)) return;
    event.preventDefault();
    event.stopPropagation();
    if (!window.confirm(`Remove ${item.label} from Favorites?`)) return;
    fileActions.removeFavorite(item.id);
  }

  return (
    <div className="flex flex-col gap-1 px-2 py-3">
      <div
        className={cn(
          "rounded px-2 py-0.5",
          pinFavorites && pin.isOver && fileDropOverClass,
        )}
        {...(pinFavorites ? pin.dropProps : {})}
      >
        <SmallLabel className="text-white/45">{label}</SmallLabel>
      </div>
      <div className="flex flex-col">
        {items.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            active={item.id === activeId}
            onClick={() => onSelect?.(item)}
            onContextMenu={(event) => handleItemContextMenu(event, item)}
          />
        ))}
      </div>
    </div>
  );
}
