"use server";

import {
  addDefaultersForCompletedMatch,
  addDefaultersForMatch,
  getDefaultersForMatch,
  insertToHistory,
  settleLosersForAbandonedMatch,
  settleLosersForCompletedMatch,
  settleWinnersForMatch,
  updateNoIPLWinner,
  updateNoResultForMatch,
  updateTeamsForAbandonedMatch,
  updateTeamsForCompletedMatch,
} from "@/actions/settlement.actions";
import { prisma } from "@/lib/db";
import { MatchAPIResult, PredictionAPIResult } from "@/types";
import {
  UpdateMatchFormData,
  UpdateMatchFormSchema,
} from "@/zodSchemas/match.schema";
import {
  Match,
  MatchStatus,
  MatchType,
  PredictionStatus,
} from "@prisma/client";
import { DateTime } from "luxon";
import { revalidatePath } from "next/cache";
import { INCLUDE_MATCH_DETAILS } from ".";
import { getMatchPredictions } from "./prediction.actions";

type ReturnType = {
  success: boolean;
  data: string;
};

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
  const completed = await getMatchResults();
  const lastMatch = completed?.[0] ?? ({} as MatchAPIResult);
  const istDate = DateTime.fromISO(new Date().toISOString())
    .setZone("Asia/Kolkata")
    .toISO();
  const matches = await prisma.match.findMany({
    where: { date: { gte: istDate! } },
    orderBy: [{ num: "asc" }],
    include: INCLUDE_MATCH_DETAILS,
  });
  if (!!lastMatch) return [lastMatch, ...matches];
  else return matches;
}

export async function getMatchById(id: string) {
  const match = await prisma.match.findUnique({
    where: { id },
    include: INCLUDE_MATCH_DETAILS,
  });
  return match;
}

export async function getMatchByNum(num: number) {
  if (!num) return;
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
      const match: Match | undefined = await updateMatchDB(
        values.data,
        team1Id
      );

      if (!match) return { success: false, data: "Error updating match" };
      const defaulters = await getDefaultersForMatch(match.id);
      const matchPredictions = await getMatchPredictions({
        matchId: match.id,
        fetchAll: true,
      });
      switch (match.status) {
        case MatchStatus.SCHEDULED:
          await processScheduledMatch({ match, defaulters });
          break;
        case MatchStatus.ABANDONED:
          await processAbandonedMatch({ match, defaulters, matchPredictions });
          break;
        case MatchStatus.COMPLETED:
          await processCompletedMatch({ match, defaulters, matchPredictions });
          break;
        default:
          break;
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

async function processScheduledMatch({
  match,
  defaulters,
}: {
  match: Match;
  defaulters: { id: string }[];
}) {
  if (defaulters.length > 0) {
    await addDefaultersForMatch(match, defaulters);
  }
}

async function processAbandonedMatch({
  match,
  defaulters,
  matchPredictions,
}: {
  match: Match;
  defaulters: { id: string }[];
  matchPredictions: PredictionAPIResult[];
}) {
  const winners = matchPredictions.filter(
    (pred) => pred.status === PredictionStatus.PLACED
  );

  if (defaulters.length > 0 && winners.length > 0) {
    const totalWon = winners.reduce((acc, b) => acc + b.amount, 0);
    const totalLost = defaulters.length * match.minStake;
    await settleLosersForAbandonedMatch({ match, defaulters });
    await settleWinnersForMatch({
      winners,
      totalWon,
      totalLost,
      isDouble: false,
    });
  } else {
    await updateNoResultForMatch({ match });
  }
  if (match.type === MatchType.LEAGUE) {
    const doublePred = await prisma.prediction.findFirst({
      where: { matchId: match.id, isDouble: true },
    });
    if (!!doublePred) {
      await prisma.user.update({
        where: { id: doublePred.userId },
        data: { doublesLeft: { increment: 1 } },
      });
    }
    await updateTeamsForAbandonedMatch({ match });
  }
  if (match.type === MatchType.FINAL) {
    await updateNoIPLWinner();
  }
  await insertToHistory({ match });
}

async function processCompletedMatch({
  match,
  defaulters,
  matchPredictions,
}: {
  match: Match;
  defaulters: { id: string }[];
  matchPredictions: PredictionAPIResult[];
}) {
  const winners = matchPredictions.filter(
    (pred) => pred.teamId === match.winnerId
  );
  const losers = matchPredictions
    .filter((pred) => !!pred.teamId && pred.teamId !== match.winnerId)
    .map((pred) =>
      pred.isDouble ? { ...pred, amount: pred.amount * 2 } : pred
    );

  if (defaulters.length > 0 || winners.length > 0) {
    const totalWon = winners.reduce((acc, b) => acc + b.amount, 0);
    let totalLost = losers.reduce((acc, b) => acc + b.amount, 0);
    if (totalWon > 0) {
      totalLost += defaulters.length * match.minStake;
    }

    const isDoubleWinner = winners.find((pred) => pred.isDouble);

    if (defaulters.length > 0) {
      await addDefaultersForCompletedMatch({
        match,
        defaulters,
        isDouble: match.isDoublePlayed && !!isDoubleWinner,
      });
    }
    if (totalWon > 0) {
      await settleLosersForCompletedMatch({
        losers,
        isDouble: match.isDoublePlayed && !!isDoubleWinner,
      });
      await settleWinnersForMatch({
        winners,
        totalWon,
        totalLost,
        isDouble: match.isDoublePlayed && !!isDoubleWinner,
      });
    } else {
      await settleWinnersForMatch({
        winners: losers,
        totalWon: totalLost,
        totalLost: defaulters.length * match.minStake,
        isDouble: false,
      });
    }
  } else {
    await updateNoResultForMatch({ match });
  }
  if (match.type === MatchType.LEAGUE) {
    await updateTeamsForCompletedMatch({ match });
  }
  if (match.type === MatchType.FINAL) {
    const iplWinners = await prisma.prediction.findMany({
      where: { matchId: null, teamId: match.winnerId },
    });
    const iplLosers = await prisma.prediction.findMany({
      where: { matchId: null, NOT: { teamId: match.winnerId } },
    });
    if (iplWinners.length > 0 && iplLosers.length > 0) {
      const totalWon = iplWinners.reduce((acc, b) => acc + b.amount, 0);
      const totalLost = iplLosers.reduce((acc, b) => acc + b.amount, 0);
      await settleLosersForCompletedMatch({
        losers: iplLosers,
        isDouble: false,
      });
      await settleWinnersForMatch({
        winners: iplWinners,
        totalWon,
        totalLost,
        isDouble: false,
      });
    } else {
      await updateNoIPLWinner();
    }
  }
  await insertToHistory({ match });
}
