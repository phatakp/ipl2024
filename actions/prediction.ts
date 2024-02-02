"use server";

import { getMatchById } from "@/actions/match";
import { getUserById } from "@/actions/user";
import { PredictionData } from "@/app/(protected)/_zodSchemas";
import { prisma } from "@/lib/db";
import { isPredictionCutoffPassed } from "@/lib/utils";
import { PredictionAPIResult } from "@/types";

export async function getMatchPredictions(matchId: string) {
  if (!matchId) return [] as PredictionAPIResult[];

  const preds = prisma.prediction.findMany({
    where: { matchId },
    orderBy: [{ match: { num: "desc" } }, { createdAt: "asc" }],
    include: {
      user: { select: { name: true } },
      match: {
        select: {
          id: true,
          num: true,
          team1: { select: { id: true, shortName: true, longName: true } },
          team2: { select: { id: true, shortName: true, longName: true } },
          winner: { select: { id: true, shortName: true, longName: true } },
          minStake: true,
        },
      },
      team: { select: { id: true, shortName: true, longName: true } },
    },
  });
  return preds;
}

export async function getUserPredictions(userId: string | undefined) {
  if (!userId) return [] as PredictionAPIResult[];

  const preds = prisma.prediction.findMany({
    where: { userId },
    orderBy: [{ match: { num: "desc" } }],
    include: {
      user: { select: { name: true } },
      match: {
        select: {
          id: true,
          num: true,
          team1: { select: { id: true, shortName: true, longName: true } },
          team2: { select: { id: true, shortName: true, longName: true } },
          winner: { select: { id: true, shortName: true, longName: true } },
          minStake: true,
        },
      },
      team: { select: { id: true, shortName: true, longName: true } },
    },
  });
  return preds;
}

export async function getUserPredictionForMatch(
  userId: string | undefined,
  matchId: string
) {
  if (!userId) return null;
  const pred = prisma.prediction.findUnique({
    where: { matchId_userId: { matchId, userId } },
    include: {
      user: { select: { name: true } },
      match: {
        select: {
          id: true,
          num: true,
          team1: { select: { id: true, shortName: true, longName: true } },
          team2: { select: { id: true, shortName: true, longName: true } },
          winner: { select: { id: true, shortName: true, longName: true } },
          minStake: true,
        },
      },
      team: { select: { id: true, shortName: true, longName: true } },
    },
  });
  return pred;
}

export async function validatePrediction(data: PredictionData) {
  const match = await getMatchById(data.matchId);
  const user = await getUserById(data.userId);
  const pred = await getUserPredictionForMatch(data.userId, data.matchId);

  if (!!pred) {
    //Update Prediction validations
    if (
      isPredictionCutoffPassed(match!.date) &&
      pred.teamId !== data.teamId &&
      data.amount < pred.amount * 2
    )
      return {
        success: false,
        data: `Minimum stake Rs.${pred.amount * 2}/-`,
      };
    else if (data.amount <= pred.amount)
      return {
        success: false,
        data: `Minimum stake Rs.${pred.amount + 10}/-`,
      };
  } else {
    //New Prediction validations
    if (data.amount < match!.minStake) {
      return { success: false, data: `Minimum stake Rs.${match!.minStake}/-` };
    }
    if (![match?.team1Id, match?.team2Id].includes(data.teamId)) {
      return { success: false, data: "Invalid team for match" };
    }
    if (data.isDouble && user!.doublesLeft < 1) {
      return { success: false, data: "No double chances left" };
    }
  }

  //Double already played then check if new one is for higher amount
  if (data.isDouble && match?.doublePlayed) {
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
