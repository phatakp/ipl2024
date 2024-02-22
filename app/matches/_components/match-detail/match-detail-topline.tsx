import { MatchAPIResult } from "@/types";
import { DateTime } from "luxon";

export const MatchDetailTopLine = ({ match }: { match: MatchAPIResult }) => {
  return (
    <div className="grid grid-cols-8 md:grid-cols-10 gap-16 md:gap-0 shadow-md p-2 items-center bg-darkblue text-darkblue-foreground">
      <div className="col-span-2">
        <span className="p-1  font-over text-xs md:text-sm whitespace-nowrap">
          Match {match.num}
        </span>
      </div>
      <div className="col-span-6 md:col-span-8 flex flex-col md:flex-row gap-x-2 items-start md:items-center">
        <span className="text-sm">{match.venue}</span>
        <span className="hidden md:flex text-muted-foreground">|</span>
        <span className="text-xs text-muted-foreground ">
          {DateTime.fromISO(match.date).toFormat("ff")} IST
        </span>
      </div>
    </div>
  );
};
