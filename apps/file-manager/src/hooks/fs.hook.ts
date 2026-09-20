import { sortEntries } from "@/lib";
import { useActiveStore } from "@/modules/active";
import { fsQuery, useFsStore } from "@/modules/fs";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useNavigation } from "./a.hook";

export function useVolumnes() {
  return useQuery(fsQuery.volumnes());
}

export function useFavorites() {
  const query = useQuery(fsQuery.favorites());
  const extras = useFsStore((s) => s.extraFavorites);
  const data = useMemo(() => {
    const base = query.data ?? [];
    const seen = new Set(base.map((item) => item.path));
    return [...base, ...extras.filter((item) => !seen.has(item.path))];
  }, [extras, query.data]);
  return { ...query, data };
}

export function useDirChildren(dirPath: string, pageSize?: number) {
  return useInfiniteQuery(fsQuery.dirChildren(dirPath, pageSize));
}

export function useDirItems(dirPath: string, pageSize?: number) {
  const query = useDirChildren(dirPath, pageSize);
  const sortBy = useActiveStore((s) => s.sortBy);
  const items = useMemo(() => {
    const raw = query.data?.pages.flatMap((page) => page.items) ?? [];
    return sortEntries(raw, sortBy);
  }, [query.data, sortBy]);
  return { ...query, items };
}

export function useEnsureRoot() {
  const root = useActiveStore((s) => s.root);
  const { goTo } = useNavigation();
  const { data: favorites } = useFavorites();

  useEffect(() => {
    if (root || !favorites?.[0]?.path) return;
    goTo(favorites[0].path);
  }, [root, favorites, goTo]);
}
