import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { fsApi } from "@/api/fs";

const DIR_CHILDREN_PAGE_SIZE = 50;

export const fsQueryKey = {
  volumes: () => ["volumes"] as const,
  favorites: () => ["favorites"] as const,
  dirChildren: (dirPath: string, pageSize: number) =>
    ["dirChildren", dirPath, pageSize] as const,
  stat: (path: string) => ["stat", path] as const,
};

export const fsQuery = {
  volumnes() {
    return queryOptions({
      queryKey: fsQueryKey.volumes(),
      queryFn: () => fsApi.volumes(),
    });
  },
  favorites() {
    return queryOptions({
      queryKey: fsQueryKey.favorites(),
      queryFn: () => fsApi.favorites(),
    });
  },
  dirChildren(dirPath: string, pageSize = DIR_CHILDREN_PAGE_SIZE) {
    return infiniteQueryOptions({
      queryKey: fsQueryKey.dirChildren(dirPath, pageSize),
      initialPageParam: 1,
      enabled: Boolean(dirPath),
      queryFn: ({ pageParam }) =>
        fsApi.readDir(dirPath, { page: pageParam, pageSize }),
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.page + 1 : undefined,
    });
  },
  stat(path: string) {
    return queryOptions({
      queryKey: fsQueryKey.stat(path),
      queryFn: () => fsApi.stat(path),
      enabled: Boolean(path),
    });
  },
};
