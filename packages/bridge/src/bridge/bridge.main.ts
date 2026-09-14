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

  createApi<T extends Record<string, (...args: any[]) => any>>(
    module: string,
  ): T {
    return new Proxy({} as T, {
      get: (_target, method: string | symbol) => {
        if (typeof method !== "string") return undefined;

        return (...args: unknown[]) => {
          const action = `${module}:${method}`;
          return args.length === 0
            ? this.request(action)
            : this.request(action, args[0]);
        };
      },
    });
  }

  on(...arg: any) {
    //@ts-ignore
    return this.instance.on(...arg);
  }
}
