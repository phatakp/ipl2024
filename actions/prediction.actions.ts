"use server";

import { prisma } from "@/lib/db";
import { validatePrediction } from "@/lib/validators/prediction.validators";
import { ActionResp, PredictionAPIResult } from "@/types";
import {
  PredictionFormData,
  PredictionFormSchema,
} from "@/zodSchemas/prediction.schema";
import { revalidatePath } from "next/cache";
import { PRED_MATCH_DETAILS, PRED_USER_DETAILS, TEAM_SHORT_DETAILS } from ".";

export async function getMatchPredictions(matchId: string) {
  if (!matchId) return [] as PredictionAPIResult[];

  const preds = await prisma.prediction.findMany({
    where: { matchId },
    orderBy: [{ match: { num: "desc" } }, { createdAt: "asc" }],
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
  return pred;
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
      revalidatePath("/matches/[matchNum]/page");
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
    const prediction = await db.prediction.upsert({
      where: { matchId_userId: { matchId, userId } },
      create: { teamId, amount, userId, matchId },
      update: { teamId, isDouble, amount, isUpdated: true },
    });
    if (isDouble) {
      await db.user.update({
        where: { id: userId },
        data: { doublesLeft: { decrement: 1 } },
      });
      await db.match.update({
        where: { id: matchId },
        data: { doublePlayed: true },
      });
    }
    return { success: true, data: prediction };
  });
}
