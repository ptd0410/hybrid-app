import "swiper/css";
import "swiper/css/mousewheel";
import { Mousewheel, Virtual } from "swiper/modules";
import { Swiper } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { useEffect, useRef, type PropsWithChildren } from "react";

export type SwiperWrapperProps = PropsWithChildren & {
  page?: number;
  onPageChange?: (page: number) => void;
};

export function SwiperWrapper({
  children,
  page,
  onPageChange,
}: SwiperWrapperProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  // page -> swiper
  useEffect(() => {
    const swiper = swiperRef.current;

    if (!swiper || page == null) return;
    if (swiper.activeIndex === page) return;

    swiper.slideTo(page);
  }, [page]);

  return (
    <Swiper
      className="size-full"
      modules={[Mousewheel, Virtual]}
      virtual
      mousewheel={{
        enabled: true,
        forceToAxis: true,
        thresholdDelta: 10,
        thresholdTime: 100,
      }}
      onSwiper={(swiper) => {
        swiperRef.current = swiper;

        onPageChange?.(swiper.activeIndex);
      }}
      onSlideChange={(swiper) => {
        // swiper -> page
        if (page === swiper.activeIndex) return;
        onPageChange?.(swiper.activeIndex);
      }}
    >
      {children}
    </Swiper>
  );
}
