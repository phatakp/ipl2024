import { getMatchByNum } from "@/actions/match.actions";
import { getMatchPredictions } from "@/actions/prediction.actions";
import { MatchDetailBanner } from "@/app/matches/_components/match-detail-banner";
import { TeamStats } from "@/app/matches/_components/team-stats";
import { Carousel } from "@/components/carousel/carousel";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAuthServerSession } from "@/lib/auth";
import { cn, isMatchStarted, isPredictionCutoffPassed } from "@/lib/utils";
import { MatchStatus } from "@prisma/client";
import Link from "next/link";

type MatchDetailPageProps = {
  params: {
    matchNum: string;
  };
};
const MatchDetailPage = async ({
  params: { matchNum },
}: MatchDetailPageProps) => {
  const session = await getAuthServerSession();
  const match = await getMatchByNum(parseInt(matchNum));
  if (!match) return;
  let predictions = await getMatchPredictions({
    matchId: match.id,
    fetchAll: isPredictionCutoffPassed(match.date),
    userId: session?.user.id,
  });
  const items = [
    {
      title: "",
      type: "matchpred",
      data: predictions,
    },
  ];

  return (
    <div className="w-screen pb-8">
      <MatchDetailBanner match={match} />
      <div className="mt-16 w-full max-w-6xl mx-auto">
        <Tabs
          defaultValue={
            !!session?.user.id &&
            (match.status !== MatchStatus.SCHEDULED ||
              isMatchStarted(match.date))
              ? "predictions"
              : "stats"
          }
          className="w-full px-4 justify-center items-center"
        >
          <TabsList className="">
            <TabsTrigger value="predictions" className=" font-over">
              Match Predictions
            </TabsTrigger>
            <TabsTrigger value="stats" className=" font-over">
              Team Stats
            </TabsTrigger>
          </TabsList>
          <TabsContent value="stats">
            <TeamStats match={match} />
          </TabsContent>
          <TabsContent
            value="predictions"
            className="flex items-center justify-center"
          >
            {!!session?.user.id && <Carousel data={items} />}
            {!session?.user.id && (
              <div className="w-full flex justify-center items-center gap-4">
                <span>You are not authorized</span>

                <Link
                  href="/sign-in"
                  className={cn(
                    buttonVariants({ variant: "default", size: "sm" })
                  )}
                >
                  Login now
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MatchDetailPage;
