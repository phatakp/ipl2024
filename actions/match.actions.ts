"use server";

import {
  addDefaultersForCompletedMatch,
  addDefaultersForMatch,
  addLosingBetForCompletedMatch,
  addLosingBetForMatch,
  addWinningBetForMatch,
  getDefaultersForMatch,
  getLosersForCompletedMatch,
  getWinnersForAbandonedMatch,
  getWinnersForCompletedMatch,
  insertToHistory,
  updateNoResultForMatch,
  updateTeamsForAbandonedMatch,
  updateTeamsForCompletedMatch,
} from "@/actions/settlement.actions";
import { prisma } from "@/lib/db";
import {
  UpdateMatchFormData,
  UpdateMatchFormSchema,
} from "@/zodSchemas/match.schema";
import { MatchStatus } from "@prisma/client";
import { DateTime } from "luxon";
import { revalidatePath } from "next/cache";
import { INCLUDE_MATCH_DETAILS } from ".";

type ReturnType = {
  success: boolean;
  data: string;
};

export async function getMatches() {
  const matches = await prisma.match.findMany({
    orderBy: [{ num: "asc" }],
    include: INCLUDE_MATCH_DETAILS,
  });
  return matches;
}

export async function getMatchFixtures() {
  const matches = await prisma.match.findMany({
    where: { status: MatchStatus.SCHEDULED },
    orderBy: [{ num: "asc" }],
    include: INCLUDE_MATCH_DETAILS,
  });
  return matches;
}

export async function getMatchResults() {
  const matches = await prisma.match.findMany({
    where: { NOT: { status: MatchStatus.SCHEDULED } },
    orderBy: [{ num: "desc" }],
    include: INCLUDE_MATCH_DETAILS,
  });
  return matches;
}

export async function getMatchCarouselData() {
  const istDate = DateTime.fromISO(new Date().toISOString())
    .minus({ days: 1 })
    .setZone("Asia/Kolkata")
    .toISO();
  const matches = await prisma.match.findMany({
    where: { date: { gte: istDate! } },
    orderBy: [{ num: "asc" }],
    include: INCLUDE_MATCH_DETAILS,
  });
  return matches;
}

export async function getMatchById(id: string) {
  const match = await prisma.match.findUnique({
    where: { id },
    include: INCLUDE_MATCH_DETAILS,
  });
  return match;
}

export async function getMatchByNum(num: number) {
  const match = await prisma.match.findFirst({
    where: { num },
    include: INCLUDE_MATCH_DETAILS,
  });
  return match;
}

export async function updateMatchDB(
  data: UpdateMatchFormData,
  team1Id: string
) {
  const {
    status,
    matchId,
    t1Score,
    t1Overs,
    t2Score,
    t2Overs,
    winnerId,
    batFirstId,
  } = data;
  const [team1Runs, team1Wickets] = t1Score.split("/");
  const [team2Runs, team2Wickets] = t2Score.split("/");
  let result = "-";
  if (status === MatchStatus.COMPLETED) {
    if (winnerId === team1Id) {
      const diff = parseInt(team1Runs) - parseInt(team2Runs);
      if (batFirstId === team1Id) {
        if (diff > 0) result = `${diff} runs`;
        else if (diff === 0) result = "Super Over";
        else return;
      } else {
        if (diff > 0) result = `${10 - parseInt(team1Wickets)} wickets`;
        else if (diff === 0) result = "Super Over";
        else return;
      }
    } else {
      const diff = parseInt(team2Runs) - parseInt(team1Runs);
      if (batFirstId === team1Id) {
        if (diff > 0) result = `${10 - parseInt(team2Wickets)} wickets`;
        else if (diff === 0) result = "Super Over";
        else return;
      } else {
        if (diff > 0) result = `${diff} runs`;
        else if (diff === 0) result = "Super Over";
        else return;
      }
    }
  }
  try {
    const match = await prisma.match.update({
      where: { id: matchId },
      data: {
        team1Runs: parseInt(team1Runs),
        team1Wickets: parseInt(team1Wickets),
        team1Overs: parseFloat(t1Overs),
        team2Runs: parseInt(team2Runs),
        team2Wickets: parseInt(team2Wickets),
        team2Overs: parseFloat(t2Overs),
        status,
        winnerId: winnerId === "" ? null : winnerId,
        batFirstId: batFirstId === "" ? null : batFirstId,
        result,
      },
    });
    return match;
  } catch (error) {
    console.error(error);
  }
}

export async function updateMatch(
  formData: UpdateMatchFormData,
  team1Id: string
): Promise<ReturnType> {
  const values = UpdateMatchFormSchema.safeParse(formData);
  if (!values.success) return { success: false, data: "Invalid input" };

  const resp = await prisma.$transaction(async (db) => {
    try {
      const match = await updateMatchDB(values.data, team1Id);

      if (!match) return { success: false, data: "Error updating match" };
      const defaulters = await getDefaultersForMatch(match.id);

      if (match.status === MatchStatus.SCHEDULED) {
        if (defaulters.length > 0) {
          await addDefaultersForMatch(match, defaulters);
        }
      }

      if (match.status === MatchStatus.ABANDONED) {
        const winners = await getWinnersForAbandonedMatch(match.id);

        if (defaulters.length > 0 && winners.length > 0) {
          const totalWon = winners.reduce((acc, b) => acc + b.amount, 0);
          const totalLost = defaulters.length * match.minStake;
          await addLosingBetForMatch(match, defaulters);
          await addWinningBetForMatch(winners, totalWon, totalLost);
        } else {
          await updateNoResultForMatch(match);
        }
        await updateTeamsForAbandonedMatch(match);
        await insertToHistory(match);
      }

      if (match.status === MatchStatus.COMPLETED) {
        const winners = await getWinnersForCompletedMatch(match);
        const losers = await getLosersForCompletedMatch(match);

        if (
          defaulters.length > 0 ||
          (winners.length > 0 && losers.length > 0)
        ) {
          const totalWon = winners.reduce((acc, b) => acc + b.amount, 0);
          const totalLost =
            losers.reduce((acc, b) => acc + b.amount, 0) +
            defaulters.length * match.minStake;
          if (defaulters.length > 0) {
            await addDefaultersForCompletedMatch(match, defaulters);
          }
          await addLosingBetForCompletedMatch(losers);
          await addWinningBetForMatch(winners, totalWon, totalLost);
        } else {
          await updateNoResultForMatch(match);
        }
        await updateTeamsForCompletedMatch(match);
        await insertToHistory(match);
      }

      revalidatePath("/", "layout");
      return { success: true, data: "" };
    } catch (error) {
      console.error(error);
      return { success: false, data: "Error while updating match" };
    }
  });
  return resp;
}
