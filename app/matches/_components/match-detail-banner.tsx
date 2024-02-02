import { getMatchStats } from "@/actions/match";
import { getUserPredictionForMatch } from "@/actions/prediction";
import { PredictionForm } from "@/app/(protected)/_components/prediction-form";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { getAuthServerSession } from "@/lib/auth";
import { cn, isMatchStarted } from "@/lib/utils";
import { MatchAPIResult } from "@/types";
import { MatchStatus, MatchType } from "@prisma/client";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { DateTime } from "luxon";
import Image from "next/image";
import Link from "next/link";

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

  const textColor1 = `${
    !!match.winner && match.winnerId !== match.team1Id
      ? "text-muted-foreground"
      : ""
  }`;
  const textColor2 = `${
    !!match.winner && match.winnerId !== match.team2Id
      ? "text-muted-foreground"
      : ""
  }`;
  const bgColor1 = `${
    !!match.winner && match.winnerId !== match.team1Id
      ? "bg-muted-foreground"
      : "bg-darkblue-foreground"
  }`;
  const bgColor2 = `${
    !!match.winner && match.winnerId !== match.team2Id
      ? "bg-muted-foreground"
      : "bg-darkblue-foreground"
  }`;

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
        <div className="my-4 font-heading uppercase text-xl tracking-wider">
          {match.status === "SCHEDULED"
            ? isMatchStarted(match.date)
              ? "Match In Progress"
              : "Match Scheduled"
            : match.result}
        </div>
        <div className="grid grid-cols-5 w-full">
          <div className="flex flex-col md:flex-row-reverse items-center justify-start gap-4 col-span-2">
            <div className="w-16 h-16 md:w-24 md:h-24 relative">
              <Image
                src={`/${match.team1?.shortName + "outline" ?? "default"}.png`}
                alt="team"
                fill
              />
            </div>
            <div
              className={cn(
                "flex flex-col md:items-end items-center",
                textColor1
              )}
            >
              <span className="text-xl font-heading tracking-wider uppercase md:hidden">
                {match.team1?.shortName ?? "TBC"}
              </span>
              <span className="text-xl font-heading tracking-wider uppercase hidden md:flex whitespace-nowrap truncate">
                {match.team1?.longName ?? "TBC"}
              </span>
              <span className="text-2xl text-primary">
                {match.team1Runs}/{match.team1Wickets}
              </span>
              <span className="text-sm text-muted-foreground">
                {match.team1Overs.toFixed(1)} OV
              </span>
              <div className="flex items-center justify-center gap-1 flex-nowrap shrink-0 mt-2">
                {Array.from(Array(10).keys()).map((i) => (
                  <span key={i} className={cn("h-3 w-1", bgColor1)}></span>
                ))}
              </div>
              {match.status === MatchStatus.SCHEDULED && (
                <div className="flex items-center justify-center gap-2 flex-nowrap shrink-0 mt-2">
                  {stats?.t1_last5.map((item) => (
                    <span
                      key={item.id}
                      className={cn(
                        "h-5 w-5 rounded-full flex items-center justify-center text-xs",
                        !!item.winnerId && item.winnerId === match.team1Id
                          ? "bg-green-600"
                          : !!item.winnerId
                          ? "bg-destructive"
                          : "bg-muted"
                      )}
                    >
                      {!!item.winnerId && item.winnerId === match.team1Id
                        ? "W"
                        : !!item.winnerId
                        ? "L"
                        : "-"}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="text-lg md:text-2xl font-heading uppercase font-semibold flex items-center justify-center text-muted-foreground">
            vs
          </div>
          <div className="flex flex-col md:flex-row items-center justify-start gap-4 col-span-2">
            <div className="w-16 h-16 md:w-24 md:h-24 relative">
              <Image
                src={`/${match.team2?.shortName + "outline" ?? "default"}.png`}
                alt="team"
                fill
              />
            </div>
            <div
              className={cn(
                "flex flex-col md:items-start items-center",
                textColor2
              )}
            >
              <span className="text-xl font-heading tracking-wider uppercase md:hidden">
                {match.team2?.shortName ?? "TBC"}
              </span>
              <span className="text-xl font-heading tracking-wider uppercase hidden md:flex whitespace-nowrap truncate">
                {match.team2?.longName ?? "TBC"}
              </span>
              <span className="text-2xl text-primary">
                {match.team1Runs}/{match.team1Wickets}
              </span>
              <span className="text-sm text-muted-foreground">
                {match.team1Overs.toFixed(1)} OV
              </span>
              <div className="flex items-center justify-center gap-1 flex-nowrap shrink-0 mt-2">
                {Array.from(Array(10).keys()).map((i) => (
                  <span key={i} className={cn("h-3 w-1", bgColor2)}></span>
                ))}
              </div>
              {match.status === MatchStatus.SCHEDULED && (
                <div className="flex items-center justify-center gap-2 flex-nowrap shrink-0 mt-2">
                  {stats?.t2_last5.map((item) => (
                    <span
                      key={item.id}
                      className={cn(
                        "h-5 w-5 rounded-full flex items-center justify-center text-xs",
                        !!item.winnerId && item.winnerId === match.team2Id
                          ? "bg-green-600"
                          : !!item.winnerId
                          ? "bg-destructive"
                          : "bg-muted"
                      )}
                    >
                      {!!item.winnerId && item.winnerId === match.team2Id
                        ? "W"
                        : !!item.winnerId
                        ? "L"
                        : "-"}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {!!stats &&
        stats.pct &&
        match.status === MatchStatus.SCHEDULED &&
        !isMatchStarted(match.date) && (
          <div className="flex flex-col my-4 w-full max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between text-xl font-bold">
              <span>{stats.pct}%</span>
              <span className="text-sm text-muted-foreground font-title uppercase">
                Win chances
              </span>
              <span>{100 - stats.pct}%</span>
            </div>
            <Progress value={stats.pct} />
          </div>
        )}
      <div className="flex items-center justify-center my-8">
        <PredictionForm match={match} prediction={prediction} />
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
        <div className="flex items-center justify-center gap-4">
          {match.num > 1 && (
            <Link
              href={`/matches/${match.num - 1}`}
              className={cn(buttonVariants({ variant: "default", size: "sm" }))}
            >
              <ArrowLeftIcon className="w-6 h-4" />
              Prev
            </Link>
          )}
          {match.type !== MatchType.FINAL && (
            <Link
              href={`/matches/${match.num + 1}`}
              className={cn(buttonVariants({ variant: "default", size: "sm" }))}
            >
              Next
              <ArrowRightIcon className="w-6 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
