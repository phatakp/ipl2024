import { getMatchCarouselData } from "@/actions/match";
import { getUserPredictionForMatch } from "@/actions/prediction";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getAuthServerSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { MatchStatus } from "@prisma/client";
import { DateTime } from "luxon";
import Image from "next/image";
import Link from "next/link";

export const MatchCarousel = async () => {
  const session = await getAuthServerSession();
  const matches = await getMatchCarouselData();

  return (
    <div className="mx-auto md:col-span-2">
      <Carousel
        opts={{
          align: "center",
        }}
        className="w-[320px] sm:w-full max-w-6xl mx-auto"
      >
        <CarouselContent>
          {matches?.map(async (match) => {
            const prediction = await getUserPredictionForMatch(
              session?.user.id,
              match.id
            );
            return (
              <CarouselItem
                key={match.id}
                className="basis-1/1 sm:basis-1/3 md:basis-1/4"
              >
                <Link href={`/matches/${match.num}`} className="p-0">
                  <Card className="bg-secondary text-secondary-foreground shadow-md p-0 rounded-lg relative">
                    <Badge className="text-sm w-full justify-center font-heading tracking-wider font-light">
                      {!!prediction ? (
                        <>
                          <span className="mr-2 font-medium">
                            Current Stake:{" "}
                          </span>
                          <span>
                            Rs.{prediction.amount}/- for{" "}
                            {prediction.team?.shortName}
                          </span>
                          )
                        </>
                      ) : (
                        "No Prediction Made"
                      )}
                    </Badge>
                    <CardHeader className="p-2">
                      <CardTitle className="text-xs flex items-center justify-between gap-1 text-muted-foreground">
                        <span>Match {match.num}</span>
                        <span>{match.venue}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col space-y-2 px-2 pb-1 md:pb-3">
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-2">
                          <Image
                            src={`/${match.team1?.shortName}.png`}
                            alt=""
                            width={30}
                            height={30}
                          />
                          <span className="text-xs">
                            {match.team1?.shortName}
                          </span>
                        </div>
                        <div className="text-sm">
                          {match.team1Runs ?? 0}/{match.team1Wickets ?? 0}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-2">
                          <Image
                            src={`/${match.team2?.shortName}.png`}
                            alt=""
                            width={30}
                            height={30}
                          />
                          <span className="text-xs">
                            {match.team2?.shortName}
                          </span>
                        </div>
                        <div className="text-sm">
                          {match.team2Runs ?? 0}/{match.team2Wickets ?? 0}
                        </div>
                      </div>
                      <div className="text-xs font-light px-1">
                        {match.status === MatchStatus.SCHEDULED
                          ? `${DateTime.fromISO(match.date).toFormat("ff")} IST`
                          : match.result}
                      </div>
                    </CardContent>
                    <CardFooter className="pb-1 flex items-center justify-between">
                      <Link
                        href="/matches"
                        className={cn(
                          buttonVariants({ variant: "link", size: "sm" }),
                          "text-xs p-0"
                        )}
                      >
                        Schedule
                      </Link>
                      {match.doublePlayed && (
                        <Badge variant="destructive">Double Played</Badge>
                      )}
                    </CardFooter>
                  </Card>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious variant="secondary" />
        <CarouselNext variant="secondary" />
      </Carousel>
    </div>
  );
};
