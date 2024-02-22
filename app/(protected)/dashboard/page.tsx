import { ProfileCard } from "@/app/(protected)/_components/profile-card";
import { StatsCarousel } from "@/app/(protected)/_components/stats-carousel";
import { MatchCarousel } from "@/app/matches/_components/match-carousel";
import { getAuthServerSession } from "@/lib/auth";

const DashboardPage = async () => {
  const session = await getAuthServerSession();
  if (!session?.user) return null;

  return (
    <div className="flex flex-col space-y-16 w-full max-w-6xl mx-auto pb-8 mt-8 md:px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ProfileCard session={session} />
        <MatchCarousel />
      </div>
      <StatsCarousel />
    </div>
  );
};

export default DashboardPage;
