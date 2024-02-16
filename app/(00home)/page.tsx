import { PointsTable } from "@/app/(00home)/_components/points-table";
import { TeamCarousel } from "@/app/(00home)/_components/team-carousel";

export default function Home() {
  return (
    <section className="">
      <div className="bg-[url('/bg.png')] bg-center bg-no-repeat bg-cover w-full h-full py-4 relative">
        <TeamCarousel />
      </div>
      <div className="w-full max-w-6xl mx-auto py-8 px-4">
        <div className=" font-extrabold text-3xl my-8 font-over text-darkblue">
          Points Table
        </div>
        <PointsTable />
      </div>
    </section>
  );
}
