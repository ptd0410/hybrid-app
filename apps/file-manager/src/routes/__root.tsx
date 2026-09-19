import { FileList, Header, PathBar, Sidebar, StatusBar } from "@/components";
import { useNavigation } from "@/hooks";
import { createRootRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Separator } from "@/components/ui";
import { getActiveStore, type DisplayMode } from "@/modules/active";

const displayByKey: Record<string, DisplayMode> = {
  "1": "icon",
  "2": "list",
  "3": "column",
  "4": "gallery",
};

export const Route = createRootRoute({
  component: RootComponent,
});

function useFinderShortcuts() {
  const { back, forward, goUp } = useNavigation();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const meta = event.metaKey || event.ctrlKey;
      if (!meta) return;

      if (event.key === "[") {
        event.preventDefault();
        back();
      }
      if (event.key === "]") {
        event.preventDefault();
        forward();
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        goUp();
      }
      const display = displayByKey[event.key];
      if (display) {
        event.preventDefault();
        getActiveStore().setDisplay(display);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [back, forward, goUp]);
}

function RootComponent() {
  useFinderShortcuts();

  return (
    <div className="size-full flex overflow-hidden text-white">
      <Sidebar />
      <Separator orientation="vertical" className="h-full bg-white/10" />
      <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
        <Header />
        <FileList />
        <PathBar />
        <StatusBar />
      </div>
    </div>
  );
}
