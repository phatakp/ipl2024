"use client";

import { StatsCard } from "@/app/(protected)/_components/StatsCard";
import { MatchCard } from "@/app/matches/_components/match-card/match-card";
import { useDotButton } from "@/hooks/use-dot-button";
import { usePrevNextButtons } from "@/hooks/use-prev-next-buttons";
import { cn } from "@/lib/utils";
import { isCarouselDataType, isMatchType, isStatsType } from "@/types";
import { EmblaOptionsType } from "embla-carousel";
import ClassNames from "embla-carousel-class-names";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { CarouselCard } from "./carousel-card";

type CarouselProps<T> = {
  data: T[];
  options?: EmblaOptionsType;
};

export function Carousel<T>({
  data,
  options = { loop: false },
}: CarouselProps<T>) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [ClassNames()]);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <section className="w-full mx-auto space-y-4">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y space-x-8 items-start">
          {data.map((item: T, index: number) => {
            if (isStatsType(item))
              return (
                <StatsCard
                  key={item.title}
                  title={item.title}
                  amount={item.amount}
                  icon={item.icon}
                />
              );
            else if (isMatchType(item))
              return <MatchCard key={item.id} match={item} index={index} />;
            else if (isCarouselDataType(item))
              return (
                <div key={item.type} className="grid gap-4">
                  <div className="title font-over text-2xl font-bold px-4">
                    {item.title}
                  </div>
                  <CarouselCard {...item} />
                </div>
              );
          })}
        </div>
      </div>

      <div className="flex flex-nowrap justify-between items-center gap-8">
        <div className="grid grid-cols-2 items-center gap-1">
          <Button
            variant="link"
            size="icon"
            onClick={onPrevButtonClick}
            disabled={prevBtnDisabled}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="link"
            size="icon"
            onClick={onNextButtonClick}
            disabled={nextBtnDisabled}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>

        {data.length > 3 && (
          <div className="flex justify-end items-center gap-1 md:gap-3 flex-1 overflow-hidden">
            {scrollSnaps.map((_, index) => (
              <Button
                key={index}
                variant="outline"
                size="icon"
                onClick={() => onDotButtonClick(index)}
                className={cn(
                  "size-2 rounded-full",
                  index === selectedIndex ? "border-primary" : ""
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
