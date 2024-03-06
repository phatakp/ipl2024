"use client";
import { MotionDiv } from "@/components/motion-div";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserPredictionForMatch } from "@/hooks/user-prediction-for-match";
import { variants } from "@/lib/constants";
import { MatchAPIResult } from "@/types";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { MatchContext } from "../../_context/match-context";
import { MatchCardPredBadge } from "./match-card-pred-badge";
import { MatchCardResult } from "./match-card-result";
import { MatchCardScheduleLink } from "./match-card-schedule-link";
import { MatchCardTeam } from "./match-card-team";
import { MatchCardTopLine } from "./match-card-top-line";

type MatchCardProps = {
  match: MatchAPIResult;
  index: number;
};

const classNames =
  "border-CSK shadow-CSK border-MI shadow-MI border-GT shadow-GT border-RR shadow-RR border-RCB shadow-RCB border-PBKS shadow-PBKS border-LSG shadow-LSG border-SRH shadow-SRH border-KKR shadow-KKR border-DC shadow-DC";

export const MatchCard = ({ match, index }: MatchCardProps) => {
  const { data: session, status } = useSession();
  const { data: prediction, isLoading } = useUserPredictionForMatch(
    session?.user.id,
    match.id
  );

  if (status === "loading" || isLoading)
    return <Skeleton className="w-[370px] h-[225px]" />;

  return (
    <MatchContext.Provider value={{ match, prediction, session }}>
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
      >
        <Link
          href={`/matches/${match.num}`}
          className="opacity-80 hover:opacity-100 transition ease-in-out duration-300 group"
        >
          <Card
            className={`px-0 pb-2 relative w-[370px] h-[225px] mx-4 group-hover:bg-accent  shadow-xl shadow-${session?.user.profile.team?.shortName}`}
          >
            <MatchCardPredBadge />

            <MatchCardTopLine />

            <CardContent className="flex flex-col space-y-2 px-2 pb-1 md:pb-3 rounded-none">
              <MatchCardTeam t="1" />
              <MatchCardTeam t="2" />
              <MatchCardResult />
            </CardContent>

            <CardFooter className="pb-1 flex items-center justify-between px-3">
              <MatchCardScheduleLink />
              {match.isDoublePlayed && (
                <Badge variant="success">Double Played</Badge>
              )}
            </CardFooter>
          </Card>
        </Link>
      </MotionDiv>
    </MatchContext.Provider>
  );
};
