import { cn } from "@/lib/utils";
import { MatchAPIResult } from "@/types";
import Image from "next/image";

type MatchDetailTeamProps = {
  match: MatchAPIResult;
  side: "left" | "right";
};

export const MatchDetailTeam = ({ match, side }: MatchDetailTeamProps) => {
  const team = side === "left" ? match.team1 : match.team2;
  const runs = side === "left" ? match.team1Runs : match.team2Runs;
  const wickets = side === "left" ? match.team1Wickets : match.team2Wickets;
  const overs = side === "left" ? match.team1Overs : match.team2Overs;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 md:gap-4 basis-1/2",
        side === "left"
          ? "md:flex-row-reverse md:justify-start "
          : "md:flex-row md:justify-start"
      )}
    >
      <div className="relative w-12 h-12 md:w-16 md:h-16">
        <Image src={`/${team?.shortName ?? "default"}.png`} alt="team" fill />
      </div>
      <div
        className={cn(
          "flex flex-col justify-center items-center",
          side === "left" ? "md:items-end" : "md:items-start"
        )}
      >
        <span
          className={cn(
            "font-over font-light  whitespace-nowrap hidden sm:flex"
          )}
        >
          {team?.longName ?? "TBC"}
        </span>
        <span className={cn("font-over font-light  text-lg sm:hidden")}>
          {team?.shortName ?? "TBC"}
        </span>
        <span className="text-2xl font-semibold">
          {runs ?? 0}/{wickets ?? 0}
        </span>
        <span className="text-xs text-gray-400 ">
          {overs?.toFixed(1) ?? "0.0"} Ov
        </span>
      </div>
    </div>
  );
};
