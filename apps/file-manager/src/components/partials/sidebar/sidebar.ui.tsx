import { SmallLabel, Tag, Text, type IconName } from "@/components/ui";
import { cn } from "@/lib";
import type { Div } from "@/types";

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
  return (
    <div
      className={cn(
        "flex items-center gap-2 cursor-pointer rounded px-2 py-1",
        active && "bg-white/15",
        className,
      )}
      {...props}
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
  onSelect,
}: SidebarSectionProps) {
  return (
    <div className="flex flex-col gap-1 px-2 py-3">
      <SmallLabel className="px-2 text-white/45">{label}</SmallLabel>
      <div className="flex flex-col">
        {items.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            active={item.id === activeId}
            onClick={() => onSelect?.(item)}
          />
        ))}
      </div>
    </div>
  );
}
