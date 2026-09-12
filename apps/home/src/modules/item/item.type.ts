//
export type ItemLocation =
  | "main"
  | "dock"
  | "inGroup"
  | "mainLeft"
  | "mainRight"
  | "groupLeft"
  | "groupRight"
  | "null";

export type ItemType = "app" | "group";

export type Item = {
  id: string;
  name: string;
  icon: string;
  type: ItemType;

  location: ItemLocation;
  page: number;
  x: number;
  y: number;
  col: number;
  row: number;
};

//
export type RawItem = {
  id: string;
  name: string;
  logo: string;
  type: number;

  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  dApps?: RawItem[];
};
