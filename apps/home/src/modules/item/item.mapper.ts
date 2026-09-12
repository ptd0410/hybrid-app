import type { ItemType, RawItem } from "./item.type";

export const itemMapper = {
  mapRaw(input: RawItem) {
    return {
      id: input.id,
      name: input.name,
      icon: input.logo,
      type: (input.type == 5 ? "group" : "app") as ItemType,
    };
  },
};
