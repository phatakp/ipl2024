"use client";

import { MatchCard } from "@/app/matches/_components/match-card/match-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { MatchAPIResult } from "@/types";
import { MatchStatus } from "@prisma/client";
import { useEffect, useState } from "react";

type Props = {
  matches: MatchAPIResult[];
};

export function MatchScheduleCarousel({ matches }: Props) {
  const completed = matches.filter(
    (match) => match.status !== MatchStatus.SCHEDULED
  );
  const start = !!completed ? completed.reverse()[0].num - 1 : 0;
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <Carousel setApi={setApi} opts={{ startIndex: start }}>
      <CarouselContent>
        {matches.map((match, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <MatchCard match={match} index={index} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );
}
