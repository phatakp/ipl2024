import { MatchAPIResult } from "@/types";
import { MatchDetailTeam } from "./match-detail-team";

export const MatchDetailTeams = ({ match }: { match: MatchAPIResult }) => {
  return (
    <div className="col-span-8 md:col-span-6 flex items-center justify-between w-full">
      <MatchDetailTeam match={match} side="left" />
      <span className=" text-2xl text-gray-500 font-over basis-1/4 text-center">
        VS
      </span>
      <MatchDetailTeam match={match} side="right" />
    </div>
  );
};
