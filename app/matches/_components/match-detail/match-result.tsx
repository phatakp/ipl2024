import { getUserPredictionForMatch } from "@/actions/prediction.actions";
import { PredictionForm } from "@/app/(protected)/_components/prediction-form";
import { getAuthServerSession } from "@/lib/auth";
import { cn, isMatchStarted } from "@/lib/utils";
import { MatchAPIResult } from "@/types";
import { MatchStatus } from "@prisma/client";

export const MatchResult = async ({
  match,
  screen,
}: {
  match: MatchAPIResult;
  screen: "small" | "large";
}) => {
  const session = await getAuthServerSession();
  const prediction = await getUserPredictionForMatch(
    session?.user.id,
    match.id
  );
  return (
    <div
      className={cn(
        "text-xs md:text-sm ",
        screen === "small"
          ? "col-span-5  md:hidden"
          : "md:col-span-3  hidden md:flex"
      )}
    >
      {match.status === MatchStatus.SCHEDULED ? (
        isMatchStarted(match.date) ? (
          "Match In Progress"
        ) : !!session?.user.profile.teamId ? (
          <PredictionForm match={match} prediction={prediction} />
        ) : (
          "Match Scheduled"
        )
      ) : match.status === MatchStatus.COMPLETED ? (
        `${match.winner?.shortName} won by ${match.result}`
      ) : (
        "Match Abandoned"
      )}
    </div>
  );
};
