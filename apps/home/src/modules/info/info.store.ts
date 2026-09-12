import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { DeviceType } from "./info.type";

export type InfoStore = {
  device: DeviceType;
};

export const useInfoStore = create<InfoStore>()(
  immer((set) => ({
    device: "desktop",
  })),
);

export function getInfoStore() {
  return useInfoStore.getState();
}
