import { getUserPredictionForMatch } from "@/actions/prediction.actions";
import { getMatchStats } from "@/actions/stats.actions";
import { PredictionForm } from "@/app/(protected)/_components/forms/prediction-form";
import { UpdateMatchForm } from "@/app/(protected)/_components/forms/update-match-form";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { getAuthServerSession } from "@/lib/auth";
import {
  cn,
  getFormattedDate,
  getFormattedTime,
  isMatchStarted,
  isToday,
  isTomorrow,
} from "@/lib/utils";
import { MatchAPIResult, StatsResult } from "@/types";
import { MatchStatus, MatchType, UserRole } from "@prisma/client";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { MatchBannerTeam } from "./match-banner-team";

type MatchDetailBannerProps = {
  match: MatchAPIResult;
};
export const MatchDetailBanner = async ({ match }: MatchDetailBannerProps) => {
  const session = await getAuthServerSession();
  const prediction = await getUserPredictionForMatch(
    session?.user.id,
    match.id
  );
  const stats = await getMatchStats(match.team1Id, match.team2Id);

  return (
    <div className="w-full rounded-md bg-backround/90 relative flex flex-col items-center justify-center antialiased py-8">
      <div className="w-full max-w-7xl p-4 mx-auto flex flex-col items-center justify-center">
        <div className="text-sm flex flex-col md:flex-row items-center justify-center gap-2">
          <span>
            {match.type === MatchType.LEAGUE
              ? `Match ${match.num}`
              : match.type}
          </span>
          <span className="hidden md:flex">|</span>
          <span>{match?.venue}</span>
        </div>
        <div className="text-xs text-muted-foreground my-2">
          {isToday(match.date)
            ? `Today, ${getFormattedTime(match.date)}`
            : isTomorrow(match.date)
            ? `Tomorrow, ${getFormattedTime(match.date)}`
            : getFormattedDate(match.date)}{" "}
          IST
        </div>
        <Separator className="bg-muted-foreground" />
        <MatchBannerResult match={match} />

        <div className="grid grid-cols-5 w-full">
          <MatchBannerTeam match={match} last5={stats?.t1_last5} />
          <div className="text-lg md:text-2xl font-over  font-semibold flex items-center justify-center text-muted-foreground">
            vs
          </div>
          <MatchBannerTeam match={match} last5={stats?.t2_last5} side="right" />
        </div>
      </div>

      {!!stats && stats.pct && match.status === MatchStatus.SCHEDULED && (
        <MatchStatsIndicator stats={stats} />
      )}

      <div className="flex items-center justify-center my-8">
        {!!session?.user.id && (
          <PredictionForm
            match={match}
            prediction={prediction}
            session={session}
          />
        )}
        {session?.user.role === UserRole.ADMIN && (
          <UpdateMatchForm matchId={match.id} />
        )}
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="flex items-center justify-center gap-4">
          <MatchPrevButton matchNum={match.num} />
          <MatchNextButton matchNum={match.num} matchType={match.type} />
        </div>
      </div>
      {match.status === MatchStatus.COMPLETED && <BackgroundBeams />}
    </div>
  );
};

const MatchBannerResult = ({ match }: { match: MatchAPIResult }) => (
  <div className="my-4 font-over text-2xl md:text-3xl title">
    {match.status === MatchStatus.SCHEDULED
      ? isMatchStarted(match.date)
        ? "Match In Progress"
        : "Match Yet to Begin"
      : match.status === MatchStatus.COMPLETED
      ? `${match.winner?.shortName} won by ${match.result}`
      : "Match Abandoned"}
  </div>
);

const MatchStatsIndicator = ({ stats }: { stats: StatsResult }) => (
  <div className="flex flex-col my-4 w-full max-w-7xl mx-auto px-4">
    <div className="flex items-center justify-between text-xl font-bold">
      <span>{stats.pct}%</span>
      <span className="text-sm text-muted-foreground font-over ">
        Win chances
      </span>
      <span>{100 - stats.pct}%</span>
    </div>
    <Progress value={stats.pct} />
  </div>
);

const MatchPrevButton = ({ matchNum }: { matchNum: number }) => {
  if (matchNum <= 1) return null;
  return (
    <Link
      href={`/matches/${matchNum - 1}`}
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "inline-flex items-center gap-2"
      )}
    >
      <ArrowLeftIcon className="w-6 h-4" />
      Prev
    </Link>
  );
};

const MatchNextButton = ({
  matchNum,
  matchType,
}: {
  matchNum: number;
  matchType: MatchType;
}) => {
  if (matchType === MatchType.FINAL) return null;
  return (
    <Link
      href={`/matches/${matchNum + 1}`}
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "inline-flex items-center gap-2"
      )}
    >
      Next
      <ArrowRightIcon className="w-6 h-4" />
    </Link>
  );
};
