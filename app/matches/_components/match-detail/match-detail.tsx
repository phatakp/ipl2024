import { MotionDiv } from "@/components/motion-div";
import { variants } from "@/lib/constants";
import { MatchAPIResult } from "@/types";
import { MatchDetailButton } from "./match-detail-button";
import { MatchDetailResult } from "./match-detail-result";
import { MatchDetailTeams } from "./match-detail-teams";
import { MatchDetailTopLine } from "./match-detail-topline";

type MatchDetailProps = {
  match: MatchAPIResult;
  index: number;
};

export const MatchDetail = ({ match, index }: MatchDetailProps) => {
  return (
    <>
      <MotionDiv
        variants={variants}
        initial="hidden"
        whileInView="visible"
        transition={{
          delay: 0.2,
          ease: "easeInOut",
          duration: 0.25,
        }}
        viewport={{ once: true }}
        className="md:flex flex-col space-y-16 border-b border-input py-8 my-4 hidden"
      >
        <MatchDetailTopLine match={match} />
        <div className="grid grid-cols-8 md:grid-cols-10 gap-4 md:gap-0 items-center">
          <MatchDetailResult match={match} screen="large" />
          <MatchDetailTeams match={match} />
          <MatchDetailResult match={match} screen="small" />
          <MatchDetailButton matchNum={match.num} />
        </div>
      </MotionDiv>
    </>
  );
};
