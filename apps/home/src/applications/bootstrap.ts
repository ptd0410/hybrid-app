import { getGridPosition } from "@/applications/group";
import { getGridStore } from "@/modules/grid";
import { getItemStore, itemApi, itemMapper, type Item } from "@/modules/item";
import {
  computeDockLayout,
  computeGroupLayout,
  computeMainLayout,
  getLayoutStore,
} from "@/modules/layout";
import { getPageStore } from "@/modules/page";
import { getRelationStore } from "@/modules/relation";
import { useQuery } from "@tanstack/react-query";

const MOCK_GROUP_ID = "5_mock_folder";
const MOCK_GROUP_CHILD_COUNT = 4;

function computeLayout() {
  const dock = computeDockLayout();
  const main = computeMainLayout(32, dock.size.height);
  const group = computeGroupLayout(main.grid, main.cell);
  return { dock, main, group };
}

function seedMockGroup(
  items: Item[],
  mainIds: string[][],
  mainCol: number,
  groupGrid: { col: number; row: number },
) {
  const page0 = mainIds[0];
  if (!page0 || page0.length < MOCK_GROUP_CHILD_COUNT) return;

  const childIds = page0.splice(0, MOCK_GROUP_CHILD_COUNT);
  const itemById = Object.fromEntries(items.map((item) => [item.id, item]));
  if (!itemById[childIds[0]]) return;

  childIds.forEach((id, i) => {
    const child = itemById[id];
    if (!child) return;
    Object.assign(child, {
      ...getGridPosition(i, groupGrid),
      location: "inGroup",
    });
  });

  items.push({
    id: MOCK_GROUP_ID,
    name: "Folder",
    icon: "",
    type: "group",
    x: 0,
    y: 0,
    page: 0,
    col: 1,
    row: 1,
    location: "main",
  });
  page0.unshift(MOCK_GROUP_ID);
  page0.forEach((id, i) => {
    const item = itemById[id];
    if (!item) return;
    item.x = i % mainCol;
    item.y = Math.floor(i / mainCol);
    item.page = 0;
  });

  const { setParent, setChildren } = getRelationStore();
  childIds.forEach((id) => setParent(id, MOCK_GROUP_ID));
  setChildren(MOCK_GROUP_ID, childIds);

  return { [MOCK_GROUP_ID]: [childIds] };
}

async function bootstrap() {
  const { initItems } = getItemStore();
  const { setLayout } = getLayoutStore();
  const { setTotal } = getPageStore();
  const { initIds } = getGridStore();

  const layout = computeLayout();

  const { main, group } = layout;
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
    const pageIdx = i % maxPerPage;
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

  const childrenIdsMap = seedMockGroup(items, mainIds, col, group.grid);

  setLayout(layout);
  initItems(items);
  setTotal(totalPage);
  initIds({ mainIds, dockIds, childrenIdsMap });
  return true;
}

export function useBootstrap() {
  return useQuery({
    queryKey: ["bootstrap"],
    queryFn: bootstrap,
    staleTime: Infinity,
  });
}
