import {
  getFormattedDate,
  getFormattedTime,
  isToday,
  isTomorrow,
} from "@/lib/utils";
import { MatchAPIResult } from "@/types";
import { MatchType } from "@prisma/client";

export const MatchDetailTopLine = ({ match }: { match: MatchAPIResult }) => {
  return (
    <div className="grid grid-cols-8 md:grid-cols-10 gap-16 md:gap-0 shadow-md p-2 items-center bg-primary text-primary-foreground">
      <div className="col-span-2">
        <span className="p-1  font-over text-xs md:text-sm whitespace-nowrap">
          {match.type === MatchType.LEAGUE ? `Match ${match.num}` : match.type}
        </span>
      </div>
      <div className="col-span-6 md:col-span-8 flex flex-col md:flex-row gap-x-2 items-start md:items-center">
        <span className="text-sm">{match.venue}</span>
        <span className="hidden md:flex text-muted-foreground">|</span>
        <span className="text-xs text-muted-foreground ">
          {isToday(match.date)
            ? `Today, ${getFormattedTime(match.date)}`
            : isTomorrow(match.date)
            ? `Tomorrow, ${getFormattedTime(match.date)}`
            : getFormattedDate(match.date)}{" "}
          IST
        </span>
      </div>
    </div>
  );
};
