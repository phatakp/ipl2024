import { getUserPredictions } from "@/actions/prediction.actions";
import { getUsers, getUsersByResult } from "@/actions/user.actions";
import { CarouselCardWrapper } from "@/components/carousel-card/carousel-card-wrapper";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getAuthServerSession } from "@/lib/auth";

export const StatsCarousel = async () => {
  const session = await getAuthServerSession();

  if (!session?.user) return null;

  const users = await getUsers();
  const result = await getUsersByResult();
  const userPredictions = await getUserPredictions(session.user.id);

  const carouselData = [
    { type: "user", data: users, title: "Highest Balance" },
    { type: "result", data: result, title: "Highest Single Win" },
    { type: "pred", data: userPredictions, title: "Your Predictions" },
  ];
  return (
    <div className="mx-auto">
      <Carousel
        opts={{
          align: "center",
        }}
        className="w-[370px] sm:w-full max-w-6xl mx-auto"
      >
        <CarouselContent>
          {carouselData.map((item) => (
            <CarouselItem key={item.type} className="basis-1/1 sm:basis-1/2 ">
              <CarouselCardWrapper
                type={item.type as any}
                title={item.title}
                data={item.data as any}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious variant="secondary" />
        <CarouselNext variant="secondary" />
      </Carousel>
    </div>
  );
};
