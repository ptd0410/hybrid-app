import { fsQuery } from "@/modules/fs";
import { useQuery } from "@tanstack/react-query";

export function useVolumnes() {
  return useQuery(fsQuery.volumnes());
}

export function useFavorites() {
  return useQuery(fsQuery.favorites());
}
