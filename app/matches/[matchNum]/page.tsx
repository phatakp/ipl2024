import { getMatchByNum } from "@/actions/match.actions";
import { getMatchPredictions } from "@/actions/prediction.actions";
import { MatchDetailBanner } from "@/app/matches/_components/match-detail-banner";
import { TeamStats } from "@/app/matches/_components/team-stats";
import { CarouselCardWrapper } from "@/components/carousel-card/carousel-card-wrapper";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAuthServerSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
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
  let predictions = await getMatchPredictions(match.id);

  return (
    <div className="w-screen pb-8">
      <MatchDetailBanner match={match} />
      <div className="mt-24 w-full max-w-6xl mx-auto">
        <Tabs
          defaultValue={!!session?.user ? "predictions" : "stats"}
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
            {!!session?.user && (
              <CarouselCardWrapper
                type="matchpred"
                title=""
                data={predictions}
              />
            )}
            {!session?.user && (
              <div className="w-full flex justify-center items-center gap-4">
                <span>You are not authorized</span>
                <Link
                  href="/sign-in"
                  className={cn(buttonVariants({ size: "sm" }))}
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
