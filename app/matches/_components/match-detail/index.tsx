import MotionDiv from "@/components/motion-div";
import { MatchAPIResult } from "@/types";
import { MatchCenterButton } from "./match-center-button";
import { MatchDetailTeams } from "./match-detail-teams";
import { MatchDetailTopLine } from "./match-detail-topline";
import { MatchResult } from "./match-result";

type MatchDetailProps = {
  match: MatchAPIResult;
};

export const MatchDetail = ({ match }: MatchDetailProps) => {
  return (
    <MotionDiv className="flex flex-col space-y-8 border-b py-8 drop-shadow-md my-4">
      <MatchDetailTopLine match={match} />
      <div className="grid grid-cols-8 md:grid-cols-10 gap-4 md:gap-0 items-center">
        <MatchResult match={match} screen="large" />
        <MatchDetailTeams match={match} />
        <MatchResult match={match} screen="small" />
        <MatchCenterButton matchNum={match.num} />
      </div>
    </MotionDiv>
  );
};
