import { cn } from "@/lib/utils";
import Image from "next/image";

type RecentTeamProps = {
  shortName: string;
  longName: string;
  isWinner: boolean;
  dir?: "left" | "right";
};

export const RecentTeam = ({
  shortName,
  longName,
  isWinner,
  dir = "left",
}: RecentTeamProps) => (
  <div
    className={cn(
      "w-full flex items-center justify-end gap-4 col-span-2",
      dir === "left" ? "flex-row" : "flex-row-reverse"
    )}
  >
    <span
      className={cn(
        "font-over   text-lg md:hidden",
        !isWinner && "text-muted-foreground"
      )}
    >
      {shortName}
    </span>
    <span
      className={cn(
        "font-over font-light   text-lg hidden md:flex",
        !isWinner && "text-muted-foreground"
      )}
    >
      {longName}
    </span>
    <div className="relative w-8 h-8 md:w-12 md:h-12 ">
      <Image src={`/${shortName}.png`} alt="teamLogo" fill />
    </div>
  </div>
);
