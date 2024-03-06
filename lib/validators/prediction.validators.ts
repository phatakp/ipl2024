import { getMatchById } from "@/actions/match.actions";
import {
  getHighestPredictionForMatch,
  getUserPredictionForMatch,
} from "@/actions/prediction.actions";
import { getUserById } from "@/actions/user.actions";
import { prisma } from "@/lib/db";
import { isDoubleCutoffPassed, isPredictionCutoffPassed } from "@/lib/utils";
import { MatchAPIResult, PredictionAPIResult, UserAPIResult } from "@/types";
import { PredictionFormData } from "@/zodSchemas/prediction.schema";
import { MatchType } from "@prisma/client";

export function isValidTeamChange(
  data: PredictionFormData,
  pred: PredictionAPIResult
) {
  return !(
    isPredictionCutoffPassed(pred.match!.date) &&
    pred.teamId !== data.teamId &&
    data.amount < pred.amount * 2
  );
}

export function isValidAmount(data: PredictionFormData, match: MatchAPIResult) {
  return data.amount >= match.minStake;
}

export function isValidTeam(data: PredictionFormData, match: MatchAPIResult) {
  return [match.team1Id, match.team2Id].includes(data.teamId);
}

export function isValidDouble(data: PredictionFormData, user: UserAPIResult) {
  if (!data.isDouble) return true;

  return (
    data.isDouble &&
    user.doublesLeft > 0 &&
    !isDoubleCutoffPassed(data.matchDate)
  );
}

export async function validatePrediction(data: PredictionFormData) {
  const match = await getMatchById(data.matchId);
  const user = await getUserById(data.userId);
  const pred = await getUserPredictionForMatch(data.userId, data.matchId);

  if (!match) return { success: false, data: "Match not found" };
  if (!user) return { success: false, data: "User not found" };

  //Double cutoff passed
  if (data.isDouble && isDoubleCutoffPassed(match.date)) {
    return {
      success: false,
      data: "Double Cutoff has passed",
    };
  }

  //Double validations
  if (data.isDouble) {
    if (match.type !== MatchType.LEAGUE) {
      return {
        success: false,
        data: "Double only valid for League Matches",
      };
    }
    const maxAmt = await getHighestPredictionForMatch(match);
    if (data.amount <= maxAmt)
      return {
        success: false,
        data: `Minimum stake for double Rs.${maxAmt + 10}/-`,
      };
  }

  //Double already played then check if new one is for higher amount
  if (data.isDouble && match?.isDoublePlayed) {
    const doublePred = await prisma.prediction.findFirst({
      where: { isDouble: true },
    });
    if (!!doublePred && doublePred.amount >= data.amount)
      return {
        success: false,
        data: `Minimum stake for double Rs.${doublePred.amount + 10}/-`,
      };
  }

  if (!!pred) {
    //Update Prediction validations
    if (!data.isDouble && pred.isDouble)
      return { success: false, data: "Double cannot be retracted" };
    if (!isValidTeamChange(data, pred))
      return { success: false, data: `Minimum stake Rs.${pred.amount * 2}/-` };
    else if (data.amount <= pred.amount)
      return { success: false, data: `Minimum stake Rs.${pred.amount + 10}/-` };
  } else {
    //New Prediction validations
    if (isPredictionCutoffPassed(match.date))
      return { success: false, data: "Cutoff passed for prediction" };

    if (!isValidAmount(data, match))
      return { success: false, data: `Minimum stake Rs.${match.minStake}/-` };

    if (!isValidTeam(data, match))
      return { success: false, data: "Invalid team for match" };

    if (!isValidDouble(data, user))
      return { success: false, data: "Double not allowed" };
  }

  return { success: true, data: "" };
}
