import { useClickRoot, useVolumnes } from "@/hooks";
import { useActiveStore } from "@/modules/active";
import { SidebarSection, type ISidebarItem } from "./sidebar.ui";

export type VolumesProps = {};

export function Volumes({}: VolumesProps) {
  const { data } = useVolumnes();
  const root = useActiveStore((s) => s.root);
  const clickRoot = useClickRoot();

  if (!data || data.length < 2) return null;

  const items: ISidebarItem[] = data.map((item) => ({
    label: item.name,
    id: item.path,
    icon: "HardDrive",
  }));

  return (
    <SidebarSection
      label="Volumes"
      items={items}
      activeId={root}
      onSelect={(item) => clickRoot(item.id)}
    />
  );
}
