import { BridgeAbstract } from "./bridge.type";
import { getBridgeType } from "./helper";
import { ElectronBridge } from "./variant";

export class Bridge {
  type = getBridgeType();
  instance: BridgeAbstract<any>;

  constructor() {
    switch (this.type) {
      case "electron":
        this.instance = new ElectronBridge();
        break;
      default: {
        throw new Error(`Invalid bridge type`);
      }
    }
  }

  request<R>(action: string, data?: any): Promise<R> {
    return this.instance.request(action, data);
  }

  on(...arg: any) {
    //@ts-ignore
    return this.instance.on(...arg);
  }
}
