import { MotionDiv } from "@/components/motion-div";
import { MatchAPIResult } from "@/types";
import { MatchCenterButton } from "./match-center-button";
import { MatchDetailTeams } from "./match-detail-teams";
import { MatchDetailTopLine } from "./match-detail-topline";
import { MatchResult } from "./match-result";

type MatchDetailProps = {
  match: MatchAPIResult;
  index: number;
};

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const MatchDetail = ({ match, index }: MatchDetailProps) => {
  return (
    <MotionDiv
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{
        delay: index * 0.25,
        ease: "easeInOut",
        duration: 0.5,
      }}
      viewport={{ amount: 0 }}
      className="flex flex-col space-y-8 border-b py-8 drop-shadow-md my-4"
    >
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
