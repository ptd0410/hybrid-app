export type BridgeType = "electron";

export interface BridgeAbstract<T extends Record<string, any>> {
  request<R>(action: string, data?: any): Promise<R>;
  on<K extends keyof T>(event: K, callback: (data: T[K]) => void): void;
}
