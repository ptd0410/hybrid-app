import type { ReactNode } from "react";
import type { Item, ItemLocation } from "../item";
import type { DockLayout, GroupLayout, MainLayout } from "../layout";
import type {
  Bound,
  ClientPoint,
  Point,
  Position,
  WithIconSize,
} from "@/types";

export type Snap = Position & WithIconSize;

export type TransformMap = Record<string, Point>;

export type ColliedItem = Point & {
  itemId: string;
  page: number;
};

export type HoverKind = "push" | "group";

export type DragDwell = {
  itemId: string;
  origin: ClientPoint;
  timeoutId: number;
  committed: boolean;
};

export type DragDirection = "up" | "down" | "left" | "right";

export type Target = Partial<Point> & {
  page: number;
  location: ItemLocation;
};

export type DragPhase = "idle" | "dragging" | "ending";

export type DockBound = Bound & {
  width: number;
};

export type DockIconSnapshot = {
  rollback: number;
  target: number;
};

export type DockLayoutSnapshot = DockLayout &
  WithIconSize & {
    boundIn: DockBound;
    boundOut: DockBound;
  };

export type LayoutSnapshot = {
  main: MainLayout;
  group: GroupLayout;
  dock: DockLayoutSnapshot;
  iconSize: number;
};

export type PositionSnapshot = {
  origin: Position;
  offset: Position;
};

export type OccupedSnapshot = {
  main: Record<string, string>;
  dock: Record<string, string>;
  group: Record<string, string>;
};

export type DragSnapshot = {
  item: Item;
  node: ReactNode;
  layout: LayoutSnapshot;
  position: PositionSnapshot;
  occupied: OccupedSnapshot;
};

export type DragCurrent = {
  clientPoint: ClientPoint;
  target: Target;
  dockBound: DockBound;
  direction?: DragDirection;
  colliedItems: ColliedItem[];
  snap?: Snap;
};

export type DragPreview = {
  groupWith?: string;
  transformMap?: TransformMap;
};
