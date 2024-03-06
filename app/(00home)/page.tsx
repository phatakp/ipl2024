import { TeamCarousel } from "@/app/(00home)/_components/team-carousel";
import { Spotlight } from "@/components/ui/spotlight";
import { PointsTable } from "./_components/points-table";

export default async function Home() {
  return (
    <section className="w-full max-w-6xl mx-auto py-8 px-4 sm:px-0 space-y-8 -mt-8">
      <div className="h-[25rem] w-full rounded-md flex md:items-center md:justify-center bg-background/90 antialiased bg-grid-white/[0.02] relative overflow-hidden">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />
        <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
          <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
            Fantasy <br /> Premier League <br /> 2024
          </h1>
          <p className="mt-4 font-normal text-base text-foreground max-w-lg text-center mx-auto">
            Start your winning journey now.
          </p>
        </div>
      </div>
      <TeamCarousel />

      <PointsTable />
    </section>
  );
}
