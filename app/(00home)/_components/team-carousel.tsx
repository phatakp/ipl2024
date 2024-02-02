import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Teams } from "@/lib/constants";
import Image from "next/image";

export const TeamCarousel = () => {
  return (
    <div className="mx-auto w-screen">
      <Carousel
        opts={{
          align: "center",
          loop: true,
        }}
        className="w-[300px] sm:w-full max-w-xl mx-auto"
      >
        <CarouselContent>
          {Object.keys(Teams).map((key, index) => (
            <CarouselItem key={key} className="basis-1/4 sm:basis-1/6">
              <div className="p-1">
                <Card className="bg-darkblue border-none">
                  <CardContent className="flex aspect-square items-center justify-center p-2">
                    <Image
                      src={`/${key}outline.png`}
                      alt=""
                      width={90}
                      height={90}
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          variant="ghost"
          className="text-darkblue-foreground hover:text-darkblue-foreground hover:bg-transparent"
        />
        <CarouselNext
          variant="ghost"
          className="text-darkblue-foreground hover:text-darkblue-foreground hover:bg-transparent"
        />
      </Carousel>
    </div>
  );
};
