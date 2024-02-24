import { MotionDiv } from "@/components/motion-div";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { variants } from "@/lib/constants";
import { MatchAPIResult } from "@/types";
import { MatchStatus } from "@prisma/client";
import { DateTime } from "luxon";
import { CarouselTeam } from "../match-carousel-team";
import { ScheduleLink } from "../schedule-link";
import { MatchCenterButton } from "./match-center-button";
import { MatchDetailTeams } from "./match-detail-teams";
import { MatchDetailTopLine } from "./match-detail-topline";
import { MatchResult } from "./match-result";

type MatchDetailProps = {
  match: MatchAPIResult;
  index: number;
};

export const MatchDetail = ({ match, index }: MatchDetailProps) => {
  return (
    <>
      <MotionDiv
        variants={variants}
        whileHover={{ scale: 1.1 }}
        initial="hidden"
        whileInView="visible"
        transition={{
          delay: 0.2,
          ease: "easeInOut",
          duration: 0.25,
        }}
        viewport={{ once: false }}
        className="md:flex flex-col space-y-8 border-b py-8 drop-shadow-md my-4 hidden"
      >
        <MatchDetailTopLine match={match} />
        <div className="grid grid-cols-8 md:grid-cols-10 gap-4 md:gap-0 items-center">
          <MatchResult match={match} screen="large" />
          <MatchDetailTeams match={match} />
          <MatchResult match={match} screen="small" />
          <MatchCenterButton matchNum={match.num} />
        </div>
      </MotionDiv>
      <Card className="md:hidden bg-secondary text-secondary-foreground shadow-md px-0 pb-2 relative w-full">
        {/* <PredictionBadge prediction={prediction} /> */}
        <CardHeader className="p-2 rounded-none">
          <CardTitle className="text-sm flex items-center justify-between gap-6 text-muted-foreground">
            <span className="shrink-0">Match {match.num}</span>
            <span className="truncate text-xs">{match.venue}</span>
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
    </>
  );
};
