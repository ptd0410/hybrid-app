import { Popover, PopoverContent, PopoverTrigger, Tag } from "@/components/ui";
import { cn } from "@/lib";
import { useActiveStore } from "@/modules/active";
import { useState } from "react";
import { SORT_OPTIONS } from "./files/file.const";

export function SortSwitch() {
  const sortBy = useActiveStore((s) => s.sortBy);
  const setSortBy = useActiveStore((s) => s.setSortBy);
  const current = SORT_OPTIONS.find((option) => option.id === sortBy) ?? SORT_OPTIONS[0];
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        title="Sort By"
        className={cn(
          "h-7 px-1.5 flex items-center gap-0.5 rounded hover:bg-white/10",
          open && "bg-white/15",
        )}
      >
        <Tag name={current.icon} size={15} />
        <Tag name="ChevronDown" size={12} className="text-white/45" />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={6}
        className="w-48 gap-0.5 p-1 bg-[#2c2c35] text-white ring-white/10"
      >
        {SORT_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            className={cn(
              "flex w-full items-center gap-2 rounded px-2 py-1.5 text-left",
              sortBy === option.id ? "bg-white/15" : "hover:bg-white/10",
            )}
            onClick={() => {
              setSortBy(option.id);
              setOpen(false);
            }}
          >
            <Tag name={option.icon} size={15} className="shrink-0" />
            <span className="flex-1 text-sm">{option.label}</span>
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
