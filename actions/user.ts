"use server";

import { prisma } from "@/lib/db";

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
          team: { select: { id: true, shortName: true, longName: true } },
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
          team: { select: { id: true, shortName: true, longName: true } },
        },
      },
    },
  });
  return user;
}
