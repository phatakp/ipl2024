import { Card, CardContent } from "@/components/ui/card";
import { MatchHistoryAPIResult } from "@/types";
import { MatchStatus } from "@prisma/client";
import { DateTime } from "luxon";
import { RecentTeam } from "./recent-team";
import { StatsTitle } from "./stats-title";

type RecentEncounterProps = {
  matches: MatchHistoryAPIResult[];
};

export const RecentEncounter = ({ matches }: RecentEncounterProps) => {
  return (
    <div className="flex flex-col justify-center items-center gap-4 w-full">
      <StatsTitle title="Recent Encounters" />
      <Card className="w-full ">
        <CardContent className="w-full flex flex-col items-center justify-center divide-y-2">
          {matches.map((match) => (
            <div
              key={match.id}
              className="grid grid-cols-5 gap-y-2 items-center w-full py-2"
            >
              <div className="col-span-5 flex flex-col items-center justify-start">
                <span className="text-xs text-muted-foreground">
                  {DateTime.fromISO(match.date!).toFormat("DD")}
                </span>
                <span className="text-sm">
                  {match.status === MatchStatus.COMPLETED
                    ? `${match.winner?.shortName} won by ${match.result}`
                    : "Match Abandoned"}
                </span>
              </div>

              <RecentTeam
                shortName={match.team1!.shortName}
                longName={match.team1!.longName}
                isWinner={
                  match.winnerId === match.team1Id ||
                  match.status === MatchStatus.ABANDONED
                }
              />
              <div />
              <RecentTeam
                shortName={match.team2!.shortName}
                longName={match.team2!.longName}
                isWinner={
                  match.winnerId === match.team2Id ||
                  match.status === MatchStatus.ABANDONED
                }
                dir="right"
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
