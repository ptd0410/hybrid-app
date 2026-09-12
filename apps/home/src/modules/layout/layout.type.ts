import type {
  computeDockLayout,
  computeGroupLayout,
  computeMainLayout,
} from "./compute-layout";

export type DockLayout = ReturnType<typeof computeDockLayout>;
export type MainLayout = ReturnType<typeof computeMainLayout>;
export type GroupLayout = ReturnType<typeof computeGroupLayout>;
