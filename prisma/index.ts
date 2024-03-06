import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

export async function getTeams() {
  const teams = await prisma.team.findMany();
  return teams;
}

export function randomNumberBetween(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
