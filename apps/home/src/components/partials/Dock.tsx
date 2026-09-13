import { Fragment } from "react";
import { motion } from "framer-motion";
import {
  usePickGridStore,
  usePickInfoStore,
  usePickLayoutStore,
} from "@/hooks";
import { useDragStore } from "@/modules/drag";
import {
  DockApp,
  DockSeparator,
  RecentApp,
  RecentWindow,
  Trash,
} from "../features";

const dockWidthTransition = {
  type: "spring" as const,
  stiffness: 500,
  damping: 38,
  mass: 0.8,
};

export type DockProps = {};

export function Dock({}: DockProps) {
  const { dock } = usePickLayoutStore("dock");
  const { wrapperHeight, size, paddingX, gap } = dock;
  const { dockIds, recentAppIds, recentWindowIds } = usePickGridStore(
    "dockIds",
    "recentAppIds",
    "recentWindowIds",
  );
  const { device } = usePickInfoStore("device");
  const isDesktop = device === "desktop";
  const hasRegion3 = recentWindowIds.length > 0 || isDesktop;
  const boundWidth = useDragStore((s) =>
    s.phase === "idle" ? undefined : s.current?.dockBound.width,
  );
  const section1Width =
    boundWidth == null ? undefined : Math.max(0, boundWidth - paddingX * 2);
  const hasSection1 = dockIds.length > 0 || section1Width != null;

  const regions = [
    hasSection1
      ? {
          key: "dock",
          items: (
            <motion.div
              className="flex h-full items-center overflow-hidden"
              style={{ gap }}
              initial={false}
              animate={{ width: section1Width ?? "auto" }}
              transition={dockWidthTransition}
            >
              {dockIds.map((id) => (
                <DockApp key={id} itemId={id} />
              ))}
            </motion.div>
          ),
        }
      : null,
    recentAppIds.length
      ? {
          key: "recent-apps",
          items: recentAppIds.map((id) => <RecentApp key={id} itemId={id} />),
        }
      : null,
    hasRegion3
      ? {
          key: "recent-windows",
          items: (
            <>
              {recentWindowIds.map((id) => (
                <RecentWindow key={id} windowId={id} />
              ))}
              {isDesktop && <Trash />}
            </>
          ),
        }
      : null,
  ].filter((region) => region !== null);

  return (
    <div
      className="w-full border border-white/30 flex items-center justify-center"
      style={{ height: wrapperHeight }}
    >
      <motion.div
        id="dock"
        className="flex items-center bg-white/20 rounded-4xl backdrop-blur-2xl"
        layout
        initial={false}
        transition={dockWidthTransition}
        style={{
          height: size.height,
          paddingLeft: paddingX,
          paddingRight: paddingX,
          gap,
        }}
      >
        {regions.map((region, index) => (
          <Fragment key={region.key}>
            {index > 0 && <DockSeparator />}
            {region.items}
          </Fragment>
        ))}
      </motion.div>
    </div>
  );
}
