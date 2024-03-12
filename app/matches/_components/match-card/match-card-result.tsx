"use client";
import { isToday, isTomorrow } from "@/lib/utils";
import { MatchStatus } from "@prisma/client";
import { DateTime } from "luxon";
import { useMatchContext } from "../../_context/match-context";

export const MatchCardResult = () => {
  const { match } = useMatchContext();
  return (
    <div className="text-sm font-over px-1 font-semibold">
      {match.status === MatchStatus.SCHEDULED
        ? isToday(match.date)
          ? `Today, ${DateTime.fromISO(match.date).toFormat("t")} IST`
          : isTomorrow(match.date)
          ? `Tomorrow, ${DateTime.fromISO(match.date).toFormat("t")} IST`
          : `${DateTime.fromISO(match.date).toFormat("ff")} IST`
        : match.status === MatchStatus.COMPLETED
        ? `${match.winner?.shortName} won by ${match.result}`
        : "Match Abandoned"}
    </div>
  );
};
