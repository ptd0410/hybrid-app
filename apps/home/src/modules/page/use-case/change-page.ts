import { clamp } from "@/lib";
import { getPageStore } from "../page.store";

export function changePage(input: "prev" | "next") {
  const { page, total, setPage } = getPageStore();
  const next = page + (input === "next" ? 1 : -1);
  setPage(clamp(next, 0, total));
}
