"use server";

import { prisma } from "@/lib/db";
import { isIPLWinnerUpdatable } from "@/lib/utils";
import { ActionResp } from "@/types";
import {
  IsPaidFormData,
  IsPaidFormSchema,
  ProfileFormData,
  ProfileFormSchema,
  RegisterFormData,
} from "@/zodSchemas/user.schema";
import { MatchStatus, PredictionStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { TEAM_SHORT_DETAILS } from ".";

export async function updateProfile(
  formData: ProfileFormData
): Promise<ActionResp> {
  const values = ProfileFormSchema.safeParse(formData);
  if (!values.success) return { success: false, data: "Invalid input" };

  const { userId, ...data } = values.data;
  try {
    const prediction = await prisma.prediction.findFirst({
      where: { userId, matchId: null },
    });

    if (prediction?.teamId !== data.teamId && !isIPLWinnerUpdatable())
      return { success: false, data: "IPL Winner cannot be changed now" };

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

export async function createUser(data: RegisterFormData): Promise<ActionResp> {
  const { email, password } = data;
  const hash = await bcrypt.hash(password, 10);

  try {
    const isExisting = await prisma.user.findUnique({
      where: { email },
    });
    if (isExisting) return { success: false, data: "Email already exists" };

    const user = await prisma.user.create({
      data: {
        email,
        password: { create: { hash } },
        profile: { create: {} },
      },
    });

    return { success: true, data: user };
  } catch (error) {
    console.error(error);

    return { success: false, data: "Error while creating user" };
  }
}

export async function updatePassword(
  data: RegisterFormData
): Promise<ActionResp> {
  const { email, password } = data;
  const hash = await bcrypt.hash(password, 10);

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (!existingUser) return { success: false, data: "Email does not exist" };

    const user = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        email,
        password: { update: { hash } },
      },
    });

    return { success: true, data: user };
  } catch (error) {
    console.error(error);

    return { success: false, data: "Error while updating password" };
  }
}

export async function getUsers() {
  const users = await prisma.user.findMany({
    orderBy: [{ balance: "desc" }, { name: "asc" }],
    include: {
      profile: {
        select: {
          firstName: true,
          lastName: true,
          userId: true,
          teamId: true,
          isPaid: true,
          team: TEAM_SHORT_DETAILS,
        },
      },
      predictions: {
        where: {
          match: { NOT: { status: MatchStatus.SCHEDULED } },
        },
        orderBy: [{ match: { num: "desc" } }],
        take: 5,
      },
    },
  });
  return users;
}

export async function getHighestWins() {
  const users = await prisma.prediction.findMany({
    where: { status: PredictionStatus.WON },
    orderBy: [{ result: "desc" }],
    take: 10,
    include: {
      team: TEAM_SHORT_DETAILS,
      match: {
        select: {
          num: true,
          team1: TEAM_SHORT_DETAILS,
          team2: TEAM_SHORT_DETAILS,
          winner: TEAM_SHORT_DETAILS,
        },
      },
      user: {
        select: {
          name: true,
          profile: {
            select: {
              firstName: true,
              lastName: true,
              userId: true,
              teamId: true,
              isPaid: true,
              team: TEAM_SHORT_DETAILS,
            },
          },
        },
      },
    },
  });

  return users;
}

export async function getBiggestLoss() {
  const users = await prisma.prediction.findMany({
    where: { status: PredictionStatus.LOST },
    orderBy: [{ result: "asc" }],
    take: 10,
    include: {
      team: TEAM_SHORT_DETAILS,
      match: {
        select: {
          num: true,
          team1: TEAM_SHORT_DETAILS,
          team2: TEAM_SHORT_DETAILS,
          winner: TEAM_SHORT_DETAILS,
        },
      },
      user: {
        select: {
          name: true,
          profile: {
            select: {
              firstName: true,
              lastName: true,
              userId: true,
              teamId: true,
              isPaid: true,
              team: TEAM_SHORT_DETAILS,
            },
          },
        },
      },
    },
  });

  return users;
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      profile: {
        include: {
          team: TEAM_SHORT_DETAILS,
        },
      },
    },
  });
  return user;
}

export async function getUserLast5(userId: string) {
  return await prisma.prediction.findMany({
    where: {
      userId,
      match: { NOT: { status: MatchStatus.SCHEDULED } },
    },
    orderBy: [{ match: { date: "desc" } }],
    take: 5,
  });
}

export async function updateUserPaid(formData: IsPaidFormData) {
  const values = IsPaidFormSchema.safeParse(formData);
  if (!values.success) return { success: false, data: "Invalid isPaid flag" };

  const { userId, isPaid } = values.data;
  const user = await prisma.user.update({
    where: { id: userId },
    data: { profile: { update: { isPaid } } },
  });
  revalidatePath("/dashboard");
  return { success: true, data: user };
}
