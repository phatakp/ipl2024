"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { StatsType } from "@/types";
import { StatsCard } from "./StatsCard";

type Props = {
  stats: StatsType[];
};

export function StatsCarousel({ stats }: Props) {
  return (
    <Carousel>
      <CarouselContent>
        {stats.map((stat, index) => (
          <CarouselItem
            key={stat.title}
            className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
          >
            <StatsCard {...stat} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext className="right-0 lg:-right-12" />
    </Carousel>
  );
}
