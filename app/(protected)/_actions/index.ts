"use server";

import { validatePrediction } from "@/actions/prediction";
import {
  PredictionData,
  PredictionSchema,
  ProfileData,
  ProfileSchema,
} from "@/app/(protected)/_zodSchemas";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: ProfileData) {
  const values = ProfileSchema.safeParse(formData);
  if (!values.success) return { success: false, data: "Invalid input" };

  const { userId, ...data } = values.data;
  try {
    const prediction = await prisma.prediction.findFirst({
      where: { userId, matchId: null },
    });

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: `${data.firstName} ${data.lastName}`,
        profile: {
          update: {
            where: { userId },
            data,
          },
        },
        predictions: {
          upsert: [
            {
              where: { id: prediction?.id ?? "" },
              create: { amount: 500, teamId: data.teamId },
              update: { teamId: data.teamId },
            },
          ],
        },
      },
    });
    revalidatePath("/dashboard");
    return { success: true, data: user };
  } catch (error) {
    console.error(error);

    return { success: false, data: "Error while updating profile" };
  }
}

export async function createOrUpdatePrediction(formData: PredictionData) {
  const values = PredictionSchema.safeParse(formData);
  if (!values.success) return { success: false, data: "Invalid input" };

  const { success, data } = await validatePrediction(values.data);
  if (!success) return { success: false, data };

  const { userId, matchId, teamId, isDouble, amount } = values.data;

  try {
    const resp = await prisma.$transaction(async (db) => {
      const prediction = await db.prediction.upsert({
        where: { matchId_userId: { matchId, userId } },
        create: { teamId, amount, userId, matchId },
        update: { teamId, isDouble, amount, updated: true },
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
    if (resp?.success) {
      revalidatePath("/", "layout");
    }
    return resp;
  } catch (error) {
    console.error(error);

    return { success: false, data: "Error while updating prediction" };
  }
}
