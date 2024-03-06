"use client";
import { MatchStatus } from "@prisma/client";
import { DateTime } from "luxon";
import { useMatchContext } from "../../_context/match-context";

export const MatchCardResult = () => {
  const { match } = useMatchContext();
  return (
    <div className="text-sm font-over px-1 font-semibold">
      {match.status === MatchStatus.SCHEDULED
        ? `${DateTime.fromISO(match.date).toFormat("ff")} IST`
        : match.status === MatchStatus.COMPLETED
        ? `${match.winner?.shortName} won by ${match.result}`
        : "Match Abandoned"}
    </div>
  );
};
