import { BridgeAbstract } from "../bridge.type";

export class ElectronBridge implements BridgeAbstract<{}> {
  async request<R = any>(...arg: any): Promise<R> {
    return (window as any).electronAPI.request(...arg);
  }

  on<K extends never>(event: K, callback: (data: {}[K]) => void): void {}
}
