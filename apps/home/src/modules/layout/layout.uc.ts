import { getLayoutStore } from "./layout.store";

export const layoutUseCase = {
  get: () => {
    const { main, dock, group } = getLayoutStore();
    if (!main || !dock || !group) throw new Error("Layout not found");
    return { main, dock, group };
  },
};
