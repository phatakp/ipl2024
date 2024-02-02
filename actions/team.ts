"use server";

import { prisma } from "@/lib/db";

export async function getTeams() {
  const teams = await prisma.team.findMany({
    orderBy: [{ points: "desc" }, { nrr: "desc" }, { shortName: "asc" }],
  });
  return teams;
}

export async function getTeamById(id: string | null) {
  if (!id) return;
  const team = await prisma.team.findUnique({
    where: { id },
  });
  return team;
}

export async function getTeamsInfo() {
  const teamsInfo = await prisma.team.findMany({
    select: { id: true, shortName: true, longName: true },
  });
  return teamsInfo.map((t) => ({
    value: t.id,
    label: t.longName,
  }));
}
