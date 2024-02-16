import { Card, CardContent } from "@/components/ui/card";
import { MatchAPIResult, StatsResult } from "@/types";
import { StatsRowGroup } from "./stats-row-group";
import { StatsTeamHeader } from "./stats-team-header";
import { StatsTitle } from "./stats-title";

type HeadtoHeadStatsProps = {
  match: MatchAPIResult;
  stats: StatsResult;
};

export const HeadtoHeadStats = ({ match, stats }: HeadtoHeadStatsProps) => {
  return (
    <div className="flex flex-col justify-center items-center gap-4 w-full">
      <StatsTitle title="Head-to-Head" />
      <Card className="w-full">
        <StatsTeamHeader match={match} />

        <CardContent className="w-full grid grid-cols-5 gap-4 items-center py-4">
          <StatsRowGroup
            allWins={stats.t1vst2_AllWins}
            allWinPct={stats.t1vst2_WinPct}
            homeWins={stats.t1vst2_HomeWins}
            homeWinPct={stats.t1vst2_HomeWinPct}
            awayWins={stats.t1vst2_AwayWins}
            awayWinPct={stats.t1vst2_AwayWinPct}
          />

          <div className="flex flex-col items-center justify-center gap-4">
            <span className="text-xs text-muted-foreground">Played</span>
            <span className="font-bold text-4xl md:text-6xl">
              {stats.t1vst2_AllMatches}
            </span>
          </div>

          <StatsRowGroup
            allWins={stats.t2vst1_AllWins}
            allWinPct={stats.t2vst1_WinPct}
            homeWins={stats.t2vst1_HomeWins}
            homeWinPct={stats.t2vst1_HomeWinPct}
            awayWins={stats.t2vst1_AwayWins}
            awayWinPct={stats.t2vst1_AwayWinPct}
            dir="right"
          />
        </CardContent>
      </Card>
    </div>
  );
};
