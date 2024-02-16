import { getMatchByNum } from "@/actions/match.actions";
import { PredictionsTable } from "@/app/(protected)/_components/predictions-table";
import { MatchDetailBanner } from "@/app/matches/_components/match-detail-banner";
import { TeamStats } from "@/app/matches/_components/team-stats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type MatchDetailPageProps = {
  params: {
    matchNum: string;
  };
};
const MatchDetailPage = async ({
  params: { matchNum },
}: MatchDetailPageProps) => {
  const match = await getMatchByNum(parseInt(matchNum));
  if (!match) return;

  return (
    <div className="w-screen pb-8">
      <MatchDetailBanner match={match} />
      <div className="mt-24 w-full max-w-6xl mx-auto">
        <Tabs defaultValue="predictions" className="w-full px-4 text-center">
          <TabsList>
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
          <TabsContent value="predictions">
            <PredictionsTable match={match} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MatchDetailPage;
