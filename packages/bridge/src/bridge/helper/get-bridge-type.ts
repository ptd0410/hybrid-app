import { BridgeType } from "../bridge.type";

export function getBridgeType(): BridgeType | undefined {
  const w = window as any;
  console.log("wwww", {
    w,
    t: w?.electronAPI,
  });
  if (w?.electronAPI) return "electron";
}
