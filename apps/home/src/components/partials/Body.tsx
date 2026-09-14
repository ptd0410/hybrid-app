import {
  useItems,
  useMainStyle,
  usePickGridStore,
  usePickLayoutStore,
  usePickPageStore,
} from "@/hooks";
import { SwiperSlide } from "swiper/react";
import { SwiperWrapper } from "../custom";
import { MainContextMenu, MainItem } from "../features";

export type BodyProps = {};

export function Body({}: BodyProps) {
  const { page, setPage } = usePickPageStore("page", "setPage");
  const { mainIds } = usePickGridStore("mainIds");
  const { main, dock } = usePickLayoutStore("main", "dock");
  const style = useMainStyle(main, dock);
  const items = useItems(mainIds);

  const { grid } = main;

  return (
    <SwiperWrapper page={page} onPageChange={setPage}>
      {items.map((items, i) => (
        <SwiperSlide
          key={i}
          virtualIndex={i}
          className="size-full relative borrder-4"
        >
          <div className="size-full" style={style}>
            <MainContextMenu>
              <div
                className="grid size-full"
                style={{
                  gridTemplateColumns: `repeat(${grid.col}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${grid.row}, minmax(0, 1fr))`,
                }}
              >
                {items.map((item) => (
                  <MainItem key={item.id} item={item} />
                ))}
              </div>
            </MainContextMenu>
          </div>
        </SwiperSlide>
      ))}
    </SwiperWrapper>
  );
}
