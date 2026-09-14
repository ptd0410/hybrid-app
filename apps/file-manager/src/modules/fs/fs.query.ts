import { queryOptions } from "@tanstack/react-query";
import { fsApi } from "./fs.api";

export const fsQueryKey = {
  volumes: () => ["volumes"] as const,
  favorites: () => ["favorites"] as const,
};

export const fsQuery = {
  volumnes() {
    return queryOptions({
      queryKey: fsQueryKey.volumes(),
      queryFn: fsApi.volumes,
    });
  },
  favorites() {
    return queryOptions({
      queryKey: fsQueryKey.favorites(),
      queryFn: fsApi.volumes,
    });
  },
};
