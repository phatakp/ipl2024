"use client";

import { cn } from "@/lib/utils";
import { TeamShortInfo } from "@/types";
import Image from "next/image";

type MatchDetailTeamProps = {
  team: TeamShortInfo | null;
  runs?: number;
  wickets?: number;
  overs?: number;
  side: "left" | "right";
};

export const MatchDetailTeam = ({
  team,
  runs,
  wickets,
  overs,
  side,
}: MatchDetailTeamProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-start gap-2 md:gap-4 basis-1/2",
        side === "left" ? "text-left flex-row" : "text-right flex-row-reverse"
      )}
    >
      <Image
        src={`/${team?.shortName ?? "default"}.png`}
        alt="team"
        width={40}
        height={40}
      />
      <div className="flex flex-col justify-center">
        <span
          className={cn(
            "font-heading tracking-wide whitespace-nowrap hidden sm:flex"
          )}
        >
          {team?.longName ?? "TBC"}
        </span>
        <span className={cn("font-heading tracking-wide sm:hidden")}>
          {team?.shortName ?? "TBC"}
        </span>
        <span className="text-xl font-semibold">
          {runs ?? 0}/{wickets ?? 0}
        </span>
        <span className="text-xs text-gray-400 uppercase">
          {overs?.toFixed(1) ?? "0.0"} Ov
        </span>
      </div>
    </div>
  );
};
