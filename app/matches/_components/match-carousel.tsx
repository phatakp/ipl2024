import { getMatchCarouselData } from "@/actions/match.actions";
import { getUserPredictionForMatch } from "@/actions/prediction.actions";
import { Badge } from "@/components/ui/badge";
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
import { PredictionAPIResult } from "@/types";
import { MatchStatus } from "@prisma/client";
import { DateTime } from "luxon";
import Image from "next/image";
import Link from "next/link";
import { ScheduleLink } from "./schedule-link";

export const MatchCarousel = async () => {
  const session = await getAuthServerSession();
  const matches = await getMatchCarouselData();

  return (
    <div className="mx-auto md:col-span-2 w-full px-4">
      <Carousel
        opts={{
          align: "center",
        }}
        className="w-[370px] sm:w-full max-w-6xl mx-auto space-x-4"
      >
        <CarouselContent>
          {matches?.map(async (match) => {
            const prediction = await getUserPredictionForMatch(
              session?.user.id,
              match.id
            );
            return (
              <CarouselItem key={match.id} className="basis-1/1 sm:basis-1/2">
                <Link href={`/matches/${match.num}`} className="p-0">
                  <Card className="bg-secondary text-secondary-foreground shadow-md px-0 pb-2 relative min-w-80 w-full">
                    <PredictionBadge prediction={prediction} />
                    <CardHeader className="p-2 rounded-none">
                      <CardTitle className="text-xs flex items-center justify-between gap-1 text-muted-foreground">
                        <span>Match {match.num}</span>
                        <span>{match.venue}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col space-y-2 px-2 pb-1 md:pb-3 rounded-none">
                      <CarouselTeam
                        shortName={match.team1?.shortName}
                        runs={match.team1Runs}
                        wickets={match.team1Wickets}
                      />
                      <CarouselTeam
                        shortName={match.team2?.shortName}
                        runs={match.team2Runs}
                        wickets={match.team2Wickets}
                      />
                      <div className="text-sm font-over px-1 font-semibold">
                        {match.status === MatchStatus.SCHEDULED
                          ? `${DateTime.fromISO(match.date).toFormat("ff")} IST`
                          : match.status === MatchStatus.COMPLETED
                          ? `${match.winner?.shortName} won by ${match.result}`
                          : "Match Abandoned"}
                      </div>
                    </CardContent>
                    <CardFooter className="pb-1 flex items-center justify-between px-3">
                      <ScheduleLink />
                      {match.isDoublePlayed && (
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

const PredictionBadge = ({
  prediction,
}: {
  prediction: PredictionAPIResult | null;
}) => (
  <Badge
    className="text-sm w-full justify-center font-over rounded-none"
    variant={!!prediction ? "default" : "destructive"}
  >
    {!!prediction ? (
      <>
        <span className="mr-2 font-medium">Current Stake: </span>
        <span>
          Rs.{prediction.amount}/- for {prediction.team?.shortName}
        </span>
        )
      </>
    ) : (
      "No Prediction Made"
    )}
  </Badge>
);

const CarouselTeam = ({
  shortName,
  runs,
  wickets,
}: {
  shortName: string | undefined;
  runs: number;
  wickets: number;
}) => (
  <div className="flex items-center justify-between">
    <div className="inline-flex items-center gap-2">
      <Image
        src={`/${shortName ?? "default"}.png`}
        alt=""
        width={30}
        height={30}
      />
      <span className="text-xs">{shortName ?? "TBC"}</span>
    </div>
    <div className="text-sm">
      {runs}/{wickets}
    </div>
  </div>
);
