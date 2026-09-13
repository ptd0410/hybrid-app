import { Separator } from "@/components/ui";
import { usePickInfoStore } from "@/hooks";

export function DockSeparator() {
  const { device } = usePickInfoStore("device");
  if (device !== "desktop") return null;
  return <Separator orientation="vertical" className="my-3" />;
}
