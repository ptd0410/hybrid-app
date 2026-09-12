import { clamp } from "@/lib";
import type { GridSize, Size } from "@/types";

export function computeCellNPaddingX(col: number, estimatePadding: number) {
  const cellWidth = Math.floor((window.innerWidth - estimatePadding * 2) / col);
  return { cellWidth, paddingX: (window.innerWidth - cellWidth * col) / 2 };
}

export function computeDockLayout() {
  const iconSize = 40;
  const outPaddingX = 16;
  const outPaddingY = 16;
  const paddingY = 16;
  const height = iconSize + paddingY * 2;
  const wrapperHeight = height + outPaddingY * 2;
  const gap = 16;

  return {
    iconSize,
    size: {
      height,
      width: window.innerWidth - outPaddingX * 2,
    },
    paddingY,
    paddingX: gap,
    wrapperHeight,
    outPaddingY,
    gap,
  };
}

export function computeMainLayout(statusbarHeight: number, dockHeight: number) {
  // chrome
  const { innerHeight, innerWidth } = window;
  const pgHeight = 20;
  const col = Math.max(4, Math.floor(innerWidth / 180));
  const { paddingX, cellWidth } = computeCellNPaddingX(col, 16);
  const ctWidth = innerWidth - paddingX * 2;
  const ctHeight = innerHeight - dockHeight - statusbarHeight - pgHeight;
  const row = Math.floor(ctHeight / clamp(cellWidth, 120, 140));
  const cellHeight = ctHeight / row;

  return {
    statusbarHeight,
    paginationHeight: pgHeight,
    paddingX,

    grid: { col, row },
    cell: {
      height: cellHeight,
      width: cellWidth,
    },
    size: {
      height: ctHeight,
      width: ctWidth,
    },
  };
}

export const GROUP_PREVIEW_GRID = 3;

export function groupAxisSteps(target: number) {
  const steps: number[] = [];
  for (let n = GROUP_PREVIEW_GRID; n <= target; n += 1) {
    steps.push(n);
  }
  return steps;
}

export function buildGroupGridSteps(targetCol: number, targetRow: number) {
  let col = GROUP_PREVIEW_GRID;
  let row = GROUP_PREVIEW_GRID;
  const steps = [{ col, row }];
  while (col < targetCol || row < targetRow) {
    if (col < targetCol) {
      col += 1;
      steps.push({ col, row });
    }
    if (row < targetRow) {
      row += 1;
      steps.push({ col, row });
    }
  }
  return steps;
}

export function computeGroupLayout(girdSize: GridSize, cell: Size) {
  const { innerWidth, innerHeight } = window;

  const paddingX = 16;
  const paddingY = 16;
  const col = girdSize.col - 1;
  const row = girdSize.row - 1;
  const width = col * cell.width + paddingX * 2;
  const height = row * cell.height + paddingY * 2;

  return {
    size: {
      width,
      height,
    },
    bound: {
      left: (innerWidth - width) / 2,
      top: (innerHeight - height) / 2,
      right: (innerWidth + width) / 2,
      bottom: (innerHeight + height) / 2,
    },
    grid: { col, row },
    paddingX,
    paddingY,
  };
}
