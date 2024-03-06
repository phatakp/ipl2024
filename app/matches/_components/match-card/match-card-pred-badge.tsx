"use client";

import { Badge } from "@/components/ui/badge";
import { PredictionStatus } from "@prisma/client";
import { useMatchContext } from "../../_context/match-context";

export const MatchCardPredBadge = () => {
  const { prediction } = useMatchContext();

  return (
    <Badge
      className="text-sm w-full justify-center font-over rounded-none"
      variant={
        !!prediction
          ? prediction.status === PredictionStatus.WON
            ? "success"
            : [PredictionStatus.NORESULT, PredictionStatus.PLACED].includes(
                prediction.status as any
              )
            ? "default"
            : "destructive"
          : "destructive"
      }
    >
      {!!prediction ? (
        <>
          <span className="mr-2 font-medium">
            {prediction.status === PredictionStatus.PLACED
              ? "Current Stake: "
              : prediction.status === PredictionStatus.WON
              ? "You won: "
              : prediction.status === PredictionStatus.LOST
              ? "You lost: "
              : prediction.status === PredictionStatus.DEFAULT
              ? "You defaulted: "
              : "No Result"}
          </span>
          <span>
            {prediction.status === PredictionStatus.PLACED
              ? `Rs.${prediction.amount.toFixed(1)}/- for ${
                  prediction.team?.shortName
                }`
              : prediction.status === PredictionStatus.WON
              ? `Rs.${prediction.result.toFixed(1)}/- with ${
                  prediction.team?.shortName
                }`
              : prediction.status === PredictionStatus.LOST
              ? `Rs.${prediction.result.toFixed(1)}/- with ${
                  prediction.team?.shortName ?? "default"
                }`
              : prediction.status === PredictionStatus.DEFAULT
              ? `Rs.${prediction.match?.minStake?.toFixed(1)}/-`
              : ""}
          </span>
        </>
      ) : (
        "No Prediction Made"
      )}
    </Badge>
  );
};
