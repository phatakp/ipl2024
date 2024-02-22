import { getMatchById } from "@/actions/match.actions";
import { getUserPredictionForMatch } from "@/actions/prediction.actions";
import { getUserById } from "@/actions/user.actions";
import { prisma } from "@/lib/db";
import { isDoubleCutoffPassed, isPredictionCutoffPassed } from "@/lib/utils";
import { MatchAPIResult, PredictionAPIResult, UserAPIResult } from "@/types";
import { PredictionFormData } from "@/zodSchemas/prediction.schema";

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

  if (!!pred) {
    //Update Prediction validations
    if (!isValidTeamChange(data, pred))
      return { success: false, data: `Minimum stake Rs.${pred.amount * 2}/-` };
    else if (data.amount <= pred.amount)
      return { success: false, data: `Minimum stake Rs.${pred.amount + 10}/-` };
  } else {
    //New Prediction validations
    if (!isValidAmount(data, match))
      return { success: false, data: `Minimum stake Rs.${match.minStake}/-` };

    if (!isValidTeam(data, match))
      return { success: false, data: "Invalid team for match" };

    if (!isValidDouble(data, user))
      return { success: false, data: "Double not allowed" };
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
  return { success: true, data: "" };
}
