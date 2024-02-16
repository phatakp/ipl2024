import { CardHeader } from "@/components/ui/card";
import { MatchAPIResult } from "@/types";
import { StatsTeam } from "./stats-team";

type StatsTeamHeaderProps = {
  match: MatchAPIResult;
};

export const StatsTeamHeader = ({ match }: StatsTeamHeaderProps) => {
  return (
    <CardHeader className="w-full grid grid-cols-5 border-b py-2">
      <StatsTeam
        shortName={match.team1!.shortName}
        longName={match.team1!.longName}
      />
      <div />
      <StatsTeam
        shortName={match.team2!.shortName}
        longName={match.team2!.longName}
        dir="right"
      />
    </CardHeader>
  );
};
