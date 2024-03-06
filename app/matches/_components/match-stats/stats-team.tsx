import { cn } from "@/lib/utils";
import Image from "next/image";

type StatsTeamProps = {
  shortName: string;
  longName: string;
  dir?: "left" | "right";
};

export const StatsTeam = ({
  shortName,
  longName,
  dir = "left",
}: StatsTeamProps) => (
  <div
    className={cn(
      "w-full flex items-center justify-end gap-4 col-span-2",
      dir === "left" ? "flex-row" : "flex-row-reverse"
    )}
  >
    <span className="font-over   text-lg md:hidden text-secondary-foreround">
      {shortName}
    </span>
    <span className="font-over   text-lg hidden md:flex text-secondary-foreround">
      {longName}
    </span>
    <div className="relative w-12 h-12 ">
      <Image src={`/${shortName}.png`} alt="teamLogo" fill />
    </div>
  </div>
);
