import { Popover, PopoverContent, PopoverTrigger, Tag } from "@/components/ui";
import { cn } from "@/lib";
import { useActiveStore } from "@/modules/active";
import { useState } from "react";
import { DISPLAY_MODES } from "./files/file.const";

export function DisplaySwitch() {
  const display = useActiveStore((s) => s.display);
  const setDisplay = useActiveStore((s) => s.setDisplay);
  const current = DISPLAY_MODES.find((mode) => mode.id === display) ?? DISPLAY_MODES[0];
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        title="View"
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
        className="w-44 gap-0.5 p-1 bg-[#2c2c35] text-white ring-white/10"
      >
        {DISPLAY_MODES.map((mode) => (
          <button
            key={mode.id}
            type="button"
            className={cn(
              "flex w-full items-center gap-2 rounded px-2 py-1.5 text-left",
              display === mode.id ? "bg-white/15" : "hover:bg-white/10",
            )}
            onClick={() => {
              setDisplay(mode.id);
              setOpen(false);
            }}
          >
            <Tag name={mode.icon} size={15} className="shrink-0" />
            <span className="flex-1 text-sm">{mode.label}</span>
            <span className="text-[10px] text-white/40">⌘{mode.shortcut}</span>
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
