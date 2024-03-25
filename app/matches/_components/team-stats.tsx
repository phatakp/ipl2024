import { getMatchStats } from "@/actions/stats.actions";
import { MatchAPIResult } from "@/types";
import { HeadtoHeadStats } from "./match-stats/head-to-head";
import { OverallStats } from "./match-stats/overall";
import { RecentEncounter } from "./match-stats/recent-encounters";

type TeamStatsProps = {
  match: MatchAPIResult;
};

export const TeamStats = async ({ match }: TeamStatsProps) => {
  const stats = await getMatchStats(match.team1Id, match.team2Id);

  if (!stats) return;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-16">
      <HeadtoHeadStats match={match} stats={stats} />
      <OverallStats match={match} stats={stats} />
      <RecentEncounter matches={stats.recentBetween} />
    </div>
  );
};
