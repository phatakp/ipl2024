import { PredictionsTable } from "@/app/(protected)/_components/predictions-table";
import { UsersTable } from "@/app/(protected)/_components/users-table";
import { MatchCarousel } from "@/app/matches/_components/match-carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAuthServerSession } from "@/lib/auth";
import { ProfileCard } from "../_components/profile-card";

const DashboardPage = async () => {
  const session = await getAuthServerSession();

  return (
    <div className="flex flex-col space-y-16 w-full max-w-6xl mx-auto">
      <ProfileCard session={session} />

      <MatchCarousel />

      <Tabs defaultValue="leaderboard" className="w-full px-4">
        <TabsList>
          <TabsTrigger value="leaderboard" className=" font-over">
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="predictions" className=" font-over">
            My Predictions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="leaderboard">
          <UsersTable session={session} />
        </TabsContent>
        <TabsContent value="predictions">
          <PredictionsTable userId={session!.user.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;
