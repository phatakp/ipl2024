import { getTeams } from "@/actions/team.actions";
import { CarouselCardWrapper } from "@/components/carousel-card/carousel-card-wrapper";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const TeamStatsCarousel = async () => {
  const teams = await getTeams();
  return (
    <div className="mx-auto">
      <Carousel
        opts={{
          align: "center",
        }}
        className="w-[370px] sm:w-full max-w-6xl mx-auto"
      >
        <CarouselContent>
          <CarouselItem className="basis-1/1 sm:basis-1/2 mx-auto">
            <CarouselCardWrapper
              type="team"
              title="Points Table"
              data={teams}
            />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious variant="secondary" />
        <CarouselNext variant="secondary" />
      </Carousel>
    </div>
  );
};
