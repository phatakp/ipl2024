"use client";
import Image from "next/image";
import { useMatchContext } from "../../_context/match-context";

type MatchCardTeamProps = {
  t: "1" | "2";
};

export const MatchCardTeam = ({ t }: MatchCardTeamProps) => {
  const { match } = useMatchContext();
  const team = t === "1" ? match.team1 : match.team2;
  const runs = t === "1" ? match.team1Runs : match.team2Runs;
  const wickets = t === "1" ? match.team1Wickets : match.team2Wickets;

  return (
    <div className="flex items-center justify-between">
      <div className="inline-flex items-center gap-2">
        <Image
          src={`/${team?.shortName ?? "default"}.png`}
          alt=""
          width={30}
          height={30}
        />
        <span className="text-xs">{team?.shortName ?? "TBC"}</span>
      </div>
      <div className="text-sm">
        {runs}/{wickets}
      </div>
    </div>
  );
};
