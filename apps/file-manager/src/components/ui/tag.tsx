import * as Icon from "lucide-react";

type IconName = keyof typeof Icon;

export { Icon, type IconName };

export function Tag({
  name,
  className,
  size = 16,
}: {
  name?: IconName;
  className?: string;
  size?: number;
}) {
  const Comp = name ? (Icon[name] as any) : null;
  return Comp ? <Comp className={className} size={size} /> : null;
}
