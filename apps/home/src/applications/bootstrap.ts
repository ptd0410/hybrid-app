import { getGridStore } from "@/modules/grid";
import { getItemStore, itemApi, itemMapper, type Item } from "@/modules/item";
import {
  computeDockLayout,
  computeGroupLayout,
  computeMainLayout,
  getLayoutStore,
} from "@/modules/layout";
import { getPageStore } from "@/modules/page";
import { useQuery } from "@tanstack/react-query";

function computeLayout() {
  const dock = computeDockLayout();
  const main = computeMainLayout(32, dock.size.height);
  const group = computeGroupLayout(main.grid, main.cell);
  return { dock, main, group };
}

async function bootstrap() {
  const { initItems } = getItemStore();
  const { setLayout } = getLayoutStore();
  const { setTotal } = getPageStore();
  const { initIds } = getGridStore();

  const layout = computeLayout();

  const { main } = layout;
  const { col } = main.grid;

  const [mainItems, dockItems] = await Promise.all([
    itemApi.fetchMainItems(),
    itemApi.fetchDockItems(),
  ]);

  const maxRow = 2;
  const maxPerPage = maxRow * layout.main.grid.col;
  const totalPage = Math.ceil(mainItems.length / maxPerPage);
  const items: Item[] = [];
  const mainIds: string[][] = Array.from({ length: totalPage }, () => []);
  const dockIds: string[] = [];

  mainItems.forEach((rawItem, i) => {
    const page = Math.floor(i / maxPerPage);
    const pageIdx = i % 8;
    const x = pageIdx % col;
    const y = Math.floor(pageIdx / col);
    const item = itemMapper.mapRaw(rawItem);
    items.push({ ...item, x, y, page, col: 1, row: 1, location: "main" });
    mainIds[page].push(item.id);
  });
  dockItems.forEach((rawItem, i) => {
    const item = itemMapper.mapRaw(rawItem);
    items.push({
      ...item,
      x: i,
      y: 1,
      page: 0,
      col: 1,
      row: 1,
      location: "dock",
    });
    dockIds.push(item.id);
  });

  setLayout(layout);
  initItems(items);
  setTotal(totalPage);
  initIds({ mainIds, dockIds });
  return true;
}

export function useBootstrap() {
  return useQuery({
    queryKey: ["bootstrap"],
    queryFn: bootstrap,
    staleTime: Infinity,
  });
}
