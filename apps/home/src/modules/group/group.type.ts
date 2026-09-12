export type GroupPhase = "close" | "opening" | "open" | "closing";

export type GroupOrigin = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type GroupSnapshot = {
  groupId: string;
  origin: GroupOrigin;
};
