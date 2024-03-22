"use client";
import {
  getFormattedDate,
  getFormattedTime,
  isToday,
  isTomorrow,
} from "@/lib/utils";
import { MatchStatus } from "@prisma/client";
import { useMatchContext } from "../../_context/match-context";

export const MatchCardResult = () => {
  const { match } = useMatchContext();
  return (
    <div className="text-sm font-over px-1 font-semibold">
      {match.status === MatchStatus.SCHEDULED
        ? isToday(match.date)
          ? `Today, ${getFormattedTime(match.date)} IST`
          : isTomorrow(match.date)
          ? `Tomorrow, ${getFormattedTime(match.date)} IST`
          : `${getFormattedDate(match.date)} IST`
        : match.status === MatchStatus.COMPLETED
        ? `${match.winner?.shortName} won by ${match.result}`
        : "Match Abandoned"}
    </div>
  );
};
