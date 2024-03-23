"use server";

import { prisma } from "@/lib/db";
import { validatePrediction } from "@/lib/validators/prediction.validators";
import { ActionResp, MatchAPIResult, PredictionAPIResult } from "@/types";
import {
  PredictionFormData,
  PredictionFormSchema,
} from "@/zodSchemas/prediction.schema";
import { PredictionStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { PRED_MATCH_DETAILS, PRED_USER_DETAILS, TEAM_SHORT_DETAILS } from ".";

export async function getHighestPredictionForMatch(match: MatchAPIResult) {
  const pred = await prisma.prediction.aggregate({
    where: { matchId: match.id },
    _max: {
      amount: true,
    },
  });
  return pred._max.amount ?? match.minStake;
}

export async function getMatchPredictions({
  matchId,
  fetchAll,
  userId,
}: {
  matchId: string | undefined;
  fetchAll: boolean;
  userId?: string | undefined;
}) {
  if (!matchId) return [] as PredictionAPIResult[];
  let predicate: { matchId: string; userId?: string } = { matchId: matchId };
  if (!fetchAll) {
    predicate = { ...predicate, userId: userId ?? "" };
  }

  const preds = await prisma.prediction.findMany({
    where: predicate,
    orderBy: [{ result: "desc" }, { amount: "desc" }],
    include: {
      user: PRED_USER_DETAILS,
      match: PRED_MATCH_DETAILS,
      team: TEAM_SHORT_DETAILS,
    },
  });
  return preds;
}

export async function getUserPredictions(userId: string | undefined) {
  if (!userId) return [] as PredictionAPIResult[];

  const preds = await prisma.prediction.findMany({
    where: { userId },
    orderBy: [{ match: { num: "desc" } }],
    include: {
      user: PRED_USER_DETAILS,
      match: PRED_MATCH_DETAILS,
      team: TEAM_SHORT_DETAILS,
    },
  });
  return preds;
}

export async function getUserPredictionForMatch(
  userId: string | undefined,
  matchId: string
) {
  if (!userId) return null;
  const pred = await prisma.prediction.findUnique({
    where: { matchId_userId: { matchId, userId } },
    include: {
      user: PRED_USER_DETAILS,
      match: PRED_MATCH_DETAILS,
      team: TEAM_SHORT_DETAILS,
    },
  });
  return pred as PredictionAPIResult;
}

export async function createOrUpdatePrediction(
  formData: PredictionFormData
): Promise<ActionResp> {
  const values = PredictionFormSchema.safeParse(formData);
  if (!values.success) return { success: false, data: "Invalid input" };

  const { success, data } = await validatePrediction(values.data);
  if (!success) return { success: false, data };

  try {
    const resp = await predictionDBUpdate(values.data);
    if (resp?.success) {
      revalidatePath("/dashboard");
      revalidatePath("/matches/[matchNum]/page", "page");
    }
    return resp;
  } catch (error) {
    console.error(error);
    return { success: false, data: "Error while updating prediction" };
  }
}

export async function predictionDBUpdate(data: PredictionFormData) {
  const { userId, matchId, teamId, isDouble, amount } = data;
  return await prisma.$transaction(async (db) => {
    if (isDouble) {
      const existingDouble = await db.prediction.findFirst({
        where: { matchId, isDouble: true },
      });
      if (!!existingDouble && existingDouble.userId !== userId) {
        await db.user.update({
          where: { id: existingDouble.userId },
          data: {
            doublesLeft: { increment: 1 },
            predictions: {
              update: {
                where: { id: existingDouble.id },
                data: { isDouble: false },
              },
            },
          },
        });
      }
      if (!existingDouble || existingDouble.userId !== userId) {
        await db.user.update({
          where: { id: userId },
          data: { doublesLeft: { decrement: 1 } },
        });
        await db.match.update({
          where: { id: matchId },
          data: { isDoublePlayed: true },
        });
      }
    }
    const prediction = await db.prediction.upsert({
      where: { matchId_userId: { matchId, userId } },
      create: { teamId, amount, userId, matchId, isDouble },
      update: { teamId, isDouble, amount, isUpdated: true },
    });

    return { success: true, data: prediction };
  });
}

export async function getStatsForUser(userId: string) {
  const result = await prisma.prediction.groupBy({
    by: ["status", "isDouble"],
    where: {
      userId,
      status: { in: [PredictionStatus.WON, PredictionStatus.LOST] },
    },
    _sum: {
      result: true,
    },
    _count: {
      id: true,
    },
  });

  const winCount =
    result.find((item) => item.status === PredictionStatus.WON)?._count.id ?? 0;
  const lostCount =
    result.find((item) => item.status === PredictionStatus.LOST)?._count.id ??
    0;

  const won = result
    .filter((item) => item.status === PredictionStatus.WON)
    .reduce((acc, b) => acc + (b._sum.result ?? 0), 0);
  const lost = result
    .filter((item) => item.status === PredictionStatus.LOST)
    .reduce((acc, b) => acc + (b._sum.result ?? 0), 0);
  const double = result
    .filter((item) => item.isDouble === true)
    .reduce((acc, b) => acc + (b._sum.result ?? 0), 0);

  return {
    pct:
      winCount > 0 || lostCount > 0
        ? (winCount / (winCount + lostCount)) * 100
        : 0,
    double,
    won,
    lost,
  };
}
