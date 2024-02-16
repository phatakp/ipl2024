import { Card, CardContent } from "@/components/ui/card";
import { MatchAPIResult, StatsResult } from "@/types";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { StatsRowGroup } from "./stats-row-group";
import { StatsTeamHeader } from "./stats-team-header";
import { StatsTitle } from "./stats-title";

type OverallStatsProps = {
  match: MatchAPIResult;
  stats: StatsResult;
};

export const OverallStats = ({ match, stats }: OverallStatsProps) => {
  return (
    <div className="flex flex-col justify-center items-center gap-4 w-full">
      <StatsTitle title="Overall" />
      <Card className="w-full">
        <StatsTeamHeader match={match} />

        <CardContent className="w-full grid grid-cols-5 gap-4 items-center py-4">
          <StatsRowGroup
            allWins={stats.t1_AllWins}
            allWinPct={stats.t1_WinPct}
            homeWins={stats.t1_HomeWins}
            homeWinPct={stats.t1_HomeWinPct}
            awayWins={stats.t1_AwayWins}
            awayWinPct={stats.t1_AwayWinPct}
          />

          <div className="flex flex-col items-center justify-center gap-4">
            <span className="font-bold text-2xl md:text-4xl md:inline-flex items-center hidden">
              <ArrowLeftIcon className="text-muted-foreground" />
              {stats.t1_AllMatches}
            </span>
            <span className="text-xs text-muted-foreground hidden md:flex">
              Played
            </span>
            <span className="text-xs text-muted-foreground md:hidden">
              Wins
            </span>
            <span className="font-bold text-2xl md:text-4xl md:inline-flex items-center hidden">
              {stats.t2_AllMatches}
              <ArrowRightIcon className="text-muted-foreground" />
            </span>
          </div>

          <StatsRowGroup
            allWins={stats.t2_AllWins}
            allWinPct={stats.t2_WinPct}
            homeWins={stats.t2_HomeWins}
            homeWinPct={stats.t2_HomeWinPct}
            awayWins={stats.t2_AwayWins}
            awayWinPct={stats.t2_AwayWinPct}
            dir="right"
          />
        </CardContent>
      </Card>
    </div>
  );
};
