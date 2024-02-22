import { TeamCarousel } from "@/app/(00home)/_components/team-carousel";
import { TeamStatsCarousel } from "./_components/team-stats-carousel";

export default async function Home() {
  return (
    <section className="">
      <div className="bg-[url('/bg.png')] bg-center bg-no-repeat bg-cover w-full h-full py-4 relative">
        <TeamCarousel />
      </div>
      <div className="w-full max-w-6xl mx-auto py-8">
        <TeamStatsCarousel />
      </div>
    </section>
  );
}
