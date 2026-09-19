import { useClickRoot, useFavorites } from "@/hooks";
import { useActiveStore } from "@/modules/active";
import { SidebarSection, type ISidebarItem } from "./sidebar.ui";

export type FavoritesProps = {};

export function Favorites({}: FavoritesProps) {
  const { data } = useFavorites();
  const root = useActiveStore((s) => s.root);
  const clickRoot = useClickRoot();

  if (!data?.length) return null;

  const items: ISidebarItem[] = data.map((item) => ({
    label: item.name,
    id: item.path,
    icon: "Folder",
  }));

  return (
    <SidebarSection
      label="Favorites"
      items={items}
      activeId={root}
      onSelect={(item) => clickRoot(item.id)}
    />
  );
}
