import { getUserPredictionForMatch } from "@/actions/prediction.actions";
import { getMatchStats } from "@/actions/stats.actions";
import { PredictionForm } from "@/app/(protected)/_components/forms/prediction-form";
import { UpdateMatchForm } from "@/app/(protected)/_components/forms/update-match-form";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { getAuthServerSession } from "@/lib/auth";
import { cn, isMatchStarted } from "@/lib/utils";
import { MatchAPIResult, StatsResult } from "@/types";
import { MatchStatus, MatchType, UserRole } from "@prisma/client";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { DateTime } from "luxon";
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
    <div className="w-screen bg-[url('/bg.png')] bg-cover bg-no-repeat bg-center text-darkblue-foreground py-8 relative">
      <div className="w-full max-w-6xl p-4 mx-auto flex flex-col items-center justify-center">
        <div className="text-sm">
          Match {match.num} | {match?.venue}
        </div>
        <div className="text-xs text-muted-foreground my-2">
          {DateTime.fromISO(match.date).toFormat("ff")} IST
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

      {!!stats &&
        stats.pct &&
        match.status === MatchStatus.SCHEDULED &&
        !isMatchStarted(match.date) && <MatchStatsIndicator stats={stats} />}

      <div className="flex items-center justify-center my-8">
        <PredictionForm match={match} prediction={prediction} />
        {session?.user.role === UserRole.ADMIN && (
          <UpdateMatchForm matchId={match.id} />
        )}
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
        <div className="flex items-center justify-center gap-4">
          <MatchPrevButton matchNum={match.num} />
          <MatchNextButton matchNum={match.num} matchType={match.type} />
        </div>
      </div>
    </div>
  );
};

const MatchBannerResult = ({ match }: { match: MatchAPIResult }) => (
  <div className="my-4 font-over  text-xl ">
    {match.status === MatchStatus.SCHEDULED
      ? isMatchStarted(match.date)
        ? "Match In Progress"
        : "Match Scheduled"
      : match.status === MatchStatus.COMPLETED
      ? `${match.winner?.shortName} won by ${match.result}`
      : "Match Abandoned"}
  </div>
);

const MatchStatsIndicator = ({ stats }: { stats: StatsResult }) => (
  <div className="flex flex-col my-4 w-full max-w-6xl mx-auto px-4">
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
      className={cn(buttonVariants({ variant: "default", size: "sm" }))}
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
      className={cn(buttonVariants({ variant: "default", size: "sm" }))}
    >
      Next
      <ArrowRightIcon className="w-6 h-4" />
    </Link>
  );
};
