import { metadata } from "../configs";
import { windowManager } from "./window";

const actions = {
  getAppMetadata() {
    return metadata;
  },
  openApp({ id }: any) {
    return windowManager.open(id);
  },
};

export function request(action: string, data: any = {}) {
  const fn = (actions as Record<string, Function>)[action];
  if (!fn) throw new Error(`Invalid action: ${action}`);
  return fn(data);
}
