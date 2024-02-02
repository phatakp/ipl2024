import { getAuthServerSession } from "@//lib/auth";
import { getUserPredictionForMatch } from "@/actions/prediction";
import { PredictionForm } from "@/app/(protected)/_components/prediction-form";
import { MatchDetailTeam } from "@/app/matches/_components/match-detail-team";
import { buttonVariants } from "@/components/ui/button";
import { cn, isMatchStarted } from "@/lib/utils";
import { MatchAPIResult } from "@/types";
import { DateTime } from "luxon";
import Link from "next/link";

type MatchDetailProps = {
  match: MatchAPIResult;
};

export const MatchDetail = async ({ match }: MatchDetailProps) => {
  const session = await getAuthServerSession();
  const prediction = await getUserPredictionForMatch(
    session?.user.id,
    match.id
  );
  return (
    <div className="flex flex-col space-y-8 border-b py-8 drop-shadow-md my-4">
      <div className="grid grid-cols-8 md:grid-cols-10 gap-4 md:gap-0">
        <div className="col-span-2 md:col-span-3">
          <span className="p-1 uppercase font-title text-xs md:text-sm whitespace-nowrap shadow-md">
            Match {match.num}
          </span>
        </div>
        <div className="col-span-6 md:col-span-5 flex flex-col gap-1">
          <span className="text-sm">{match.venue}</span>
          <span className="text-xs text-gray-400 uppercase">
            {DateTime.fromISO(match.date).toFormat("ff")} IST
          </span>
        </div>
        <div className="col-span-2"></div>
      </div>
      <div className="grid grid-cols-8 md:grid-cols-10 gap-4 md:gap-0 items-center">
        <div className="md:col-span-3 text-xs md:text-sm uppercase hidden md:flex">
          {match.status === "SCHEDULED" ? (
            isMatchStarted(match.date) ? (
              "Match In Progress"
            ) : !!session?.user.profile.teamId ? (
              <PredictionForm match={match} prediction={prediction} />
            ) : (
              "Match Scheduled"
            )
          ) : (
            match.result
          )}
        </div>
        <div className="col-span-8 md:col-span-5 flex items-center justify-between">
          <MatchDetailTeam
            team={match.team1}
            runs={match.team1Runs}
            wickets={match.team1Wickets}
            overs={match.team1Overs}
            side="left"
          />
          <span className="uppercase text-2xl text-gray-500 font-heading basis-1/4 text-center">
            VS
          </span>
          <MatchDetailTeam
            team={match.team2}
            runs={match.team2Runs}
            wickets={match.team2Wickets}
            overs={match.team2Overs}
            side="right"
          />
        </div>
        <div className="col-span-5 text-xs md:text-sm uppercase md:hidden">
          {match.status === "SCHEDULED" ? (
            isMatchStarted(match.date) ? (
              "Match In Progress"
            ) : !!session?.user.profile.teamId ? (
              <PredictionForm match={match} prediction={prediction} />
            ) : (
              "Match Scheduled"
            )
          ) : (
            match.result
          )}
        </div>
        <div className="col-span-3 md:col-span-2 text-right md:text-center">
          <Link
            href={`/matches/${match.num}`}
            className={cn(
              "text-sm",
              buttonVariants({ variant: "default", size: "sm" })
            )}
          >
            Match Center
          </Link>
        </div>
      </div>
    </div>
  );
};
