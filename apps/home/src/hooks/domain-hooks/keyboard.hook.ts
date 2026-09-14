import { changePage } from "@/modules/page";
import { useHotkeys } from "react-hotkeys-hook";

export function useKeyboard() {
  useHotkeys("right", () => changePage("next"));
  useHotkeys("left", () => changePage("prev"));
}
