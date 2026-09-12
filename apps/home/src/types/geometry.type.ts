import type {
  DockLayout,
  GroupLayout,
  MainLayout,
} from "@/modules/layout/layout.type";

export type GridSize = {
  col: number;
  row: number;
};

export type Size = {
  width: number;
  height: number;
};

export type Point = {
  x: number;
  y: number;
};

export type Layout = {
  main: MainLayout;
  dock: DockLayout;
  group: GroupLayout;
};

export type Bound = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export type Position = {
  left: number;
  top: number;
};

export type ClientPoint = {
  clientX: number;
  clientY: number;
};

export type WithIconSize = { iconSize: number };
