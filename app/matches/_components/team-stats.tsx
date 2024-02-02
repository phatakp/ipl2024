import { getMatchStats } from "@/actions/match";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { MatchAPIResult } from "@/types";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { DateTime } from "luxon";
import Image from "next/image";

type TeamStatsProps = {
  match: MatchAPIResult;
};

export const TeamStats = async ({ match }: TeamStatsProps) => {
  const stats = await getMatchStats(match.team1Id, match.team2Id);

  if (!stats) return;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-16">
      {/* Head to Head Stats */}
      <div className="flex flex-col space-y-2">
        <StatsTitle title="Head to Head Wins" />
        <Separator />
        <div className="grid grid-cols-5 gap-2 md:gap-4 items-center">
          <div className="col-span-2 flex flex-col items-end gap-2">
            {/* Team 1 */}
            <StatsTeam
              shortName={match.team1!.shortName}
              longName={match.team1!.longName}
            />

            <StatsItem
              label="All"
              wins={stats.t1vst2_AllWins}
              matches={stats.t1vst2_AllMatches}
              winPct={stats.t1vst2_WinPct}
            />
            <StatsItem
              label="Home"
              wins={stats.t1vst2_HomeWins}
              matches={stats.t1vst2_HomeMatches}
              winPct={stats.t1vst2_HomeWinPct}
            />
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="text-xs text-muted-foreground">Total Matches</span>
            <span className="text-2xl md:text-4xl font-medium ">
              {stats.t1vst2_AllMatches}
            </span>
          </div>
          <div className="col-span-2 flex flex-col items-start gap-2">
            {/* Team 2 */}
            <StatsTeam
              shortName={match.team2!.shortName}
              longName={match.team2!.longName}
              dir="right"
            />

            <StatsItem
              label="All"
              wins={stats.t2vst1_AllWins}
              matches={stats.t1vst2_AllMatches}
              winPct={stats.t2vst1_WinPct}
              dir="right"
            />
            <StatsItem
              label="Away"
              wins={stats.t2vst1_AwayWins}
              matches={stats.t1vst2_HomeMatches}
              winPct={stats.t2vst1_AwayWinPct}
              dir="right"
            />
          </div>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="flex flex-col space-y-2">
        <StatsTitle title="Overall Wins" />
        <Separator />
        <div className="grid grid-cols-5 gap-2 md:gap-4 items-center">
          <div className="col-span-2 flex flex-col items-end gap-2">
            <StatsItem
              label="All"
              wins={stats.t1_AllWins}
              matches={stats.t1_AllMatches}
              winPct={stats.t1_WinPct}
            />
            <StatsItem
              label="Home"
              wins={stats.t1_HomeWins}
              matches={stats.t1_HomeMatches}
              winPct={stats.t1_HomeWinPct}
            />
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="text-xs text-muted-foreground">Total Matches</span>
            <span className="text-2xl md:text-4xl font-medium flex items-center">
              <ArrowLeftIcon className="w-4 h-4 text-muted-foreground" />
              {stats.t1_AllMatches}
            </span>
            <span className="text-2xl md:text-4xl font-medium flex items-center">
              {stats.t2_AllMatches}
              <ArrowRightIcon className="w-4 h-4 text-muted-foreground" />
            </span>
          </div>
          <div className="col-span-2 flex flex-col items-start gap-2">
            <StatsItem
              label="All"
              wins={stats.t2_AllWins}
              matches={stats.t2_AllMatches}
              winPct={stats.t2_WinPct}
              dir="right"
            />
            <StatsItem
              label="Away"
              wins={stats.t2_AwayWins}
              matches={stats.t2_AwayMatches}
              winPct={stats.t2_AwayWinPct}
              dir="right"
            />
          </div>
        </div>
      </div>

      {/* Recent Matches */}
      <div className="flex flex-col space-y-2">
        <StatsTitle title="Recent Encounters" />
        <Separator />
        {stats.recentBetween.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-3 gap-4 items-center my-4 border-b py-2"
          >
            <div className="text-right text-darkblue">
              {!!item.winnerId && item.winnerId === match.team1Id
                ? `${item.winner?.shortName} won by ${item.result}`
                : ""}
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-muted-foreground">
                {DateTime.fromISO(item.date!).toFormat("DD")}
              </span>
              <span className="text-xs">{item.venue}</span>
            </div>
            <div className="text-darkblue text-left">
              {!!item.winnerId && item.winnerId === match.team2Id
                ? `${item.winner?.shortName} won by ${item.result}`
                : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatsTeam = ({
  shortName,
  longName,
  dir = "left",
}: {
  shortName: string;
  longName: string;
  dir?: "left" | "right";
}) => (
  <div
    className={cn(
      "w-full flex items-center justify-end gap-4",
      dir === "left" ? "flex-row" : "flex-row-reverse"
    )}
  >
    <span className="font-heading uppercase tracking-wider text-xl md:hidden text-darkblue">
      {shortName}
    </span>
    <span className="font-heading uppercase tracking-wider text-xl hidden md:flex text-darkblue">
      {longName}
    </span>
    <Image src={`/${shortName}.png`} alt="teamLogo" width={50} height={50} />
  </div>
);

const StatsTitle = ({ title }: { title: string }) => (
  <div className="w-full text-center font-medium font-heading tracking-wider text-lg">
    {title}
  </div>
);

const StatsItem = ({
  wins,
  matches,
  winPct,
  label,
  dir = "left",
}: {
  wins: number;
  matches: number;
  winPct: number;
  label: string;
  dir?: "left" | "right";
}) => (
  <div
    className={cn(
      "flex items-center justify-end flex-nowrap gap-2 w-full",
      dir === "left" ? "flex-row" : "flex-row-reverse"
    )}
  >
    <Progress
      value={Math.floor(winPct * 100)}
      className={cn(
        "md:flex-1 hidden md:flex",
        dir === "right" && "rotate-180"
      )}
    />
    <Badge
      className={cn(
        "shrink-0 text-sm w-full md:hidden",
        dir === "left" ? "justify-end" : "justify-start"
      )}
      variant="default"
    >
      {label}: {wins}/{matches}
    </Badge>
    <Badge
      className={cn(
        "shrink-0 text-sm w-max hidden md:flex",
        dir === "left" ? "justify-end" : "justify-start"
      )}
      variant="outline"
    >
      {label}: {wins}/{matches}
    </Badge>
  </div>
);
