import { cn } from "@/lib/utils";
import { MatchAPIResult, MatchHistoryAPIResult } from "@/types";
import { MatchStatus } from "@prisma/client";
import Image from "next/image";

type MatchBannerTeamProps = {
  match: MatchAPIResult;
  last5: MatchHistoryAPIResult[] | undefined;
  side?: "left" | "right";
};

export const MatchBannerTeam = ({
  match,
  last5,
  side = "left",
}: MatchBannerTeamProps) => {
  const team = side === "left" ? match.team1 : match.team2;
  const runs = side === "left" ? match.team1Runs : match.team2Runs;
  const wickets = side === "left" ? match.team1Wickets : match.team2Wickets;
  const overs = side === "left" ? match.team1Overs : match.team2Overs;
  const isNotWinner = !!match.winnerId && match.winnerId !== team?.id;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-start gap-4 col-span-2",
        side === "left" ? "" : ""
      )}
    >
      <div
        className={cn(
          "flex flex-col items-center justify-start gap-4",
          side === "left" ? "md:flex-row-reverse" : "md:flex-row"
        )}
      >
        <div className="w-16 h-16 md:w-24 md:h-24 relative">
          <Image
            src={`/${team?.shortName + "outline" ?? "default"}.png`}
            alt="team"
            fill
          />
        </div>
        <div
          className={cn(
            "flex flex-col items-center",
            side === "left" ? "md:items-end" : "md:items-start",
            isNotWinner && "text-muted-foreground"
          )}
        >
          <span className="text-xl font-over  md:hidden">
            {team?.shortName ?? "TBC"}
          </span>
          <span className="text-xl font-over  hidden md:flex whitespace-nowrap truncate">
            {team?.longName ?? "TBC"}
          </span>
          <span className="text-2xl text-primary">
            {runs}/{wickets}
          </span>
          <span className="text-sm text-muted-foreground">
            {overs.toFixed(1)} OV
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <MatchBars teamId={team?.id} winnerId={match.winnerId} />
        {match.status === MatchStatus.SCHEDULED && (
          <FormGuide last5={last5} teamId={team?.id} />
        )}
      </div>
    </div>
  );
};

const MatchBars = ({
  winnerId,
  teamId,
}: {
  winnerId: string | null;
  teamId: string | undefined;
}) => (
  <div className="flex items-center justify-center gap-2 flex-nowrap shrink-0 mt-2">
    {Array.from(Array(10).keys()).map((i) => (
      <span
        key={i}
        className={cn(
          "h-4 w-1 md:h-5 md:w-2",
          !!winnerId && winnerId !== teamId
            ? "bg-muted-foreground"
            : "bg-darkblue-foreground"
        )}
      ></span>
    ))}
  </div>
);

const FormGuide = ({
  last5,
  teamId,
}: {
  last5: MatchHistoryAPIResult[] | undefined;
  teamId: string | undefined;
}) => (
  <div className="flex items-center justify-around flex-nowrap shrink-0 mt-2">
    {last5?.map((item) => (
      <span
        key={item.id}
        className={cn(
          "h-5 w-5 rounded-full flex items-center justify-center text-xs",
          !!item.winnerId && item.winnerId === teamId
            ? "bg-green-600"
            : !!item.winnerId
            ? "bg-destructive"
            : "bg-muted"
        )}
      >
        {!!item.winnerId && item.winnerId === teamId
          ? "W"
          : !!item.winnerId
          ? "L"
          : "-"}
      </span>
    ))}
  </div>
);
