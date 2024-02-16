import { prisma } from "@/lib/db";
import { computeNrr } from "@/lib/utils";
import { Match, PredictionStatus } from "@prisma/client";

export type PredReturnType = { id: string; amount: number; userId: string };
const PRED_VALUES = {
  id: true,
  amount: true,
  userId: true,
};

export async function getDefaultersForMatch(matchId: string) {
  return await prisma.user.findMany({
    where: {
      OR: [
        { predictions: { none: { matchId } } },
        { predictions: { some: { matchId, teamId: null } } },
      ],
    },
    select: { id: true },
  });
}

export async function addDefaultersForMatch(
  match: Match,
  defaulters: { id: string }[]
) {
  const defaultData = defaulters.map((item) => ({
    userId: item.id,
    matchId: match.id,
    amount: match.minStake,
    status: PredictionStatus.DEFAULT,
  }));
  console.log("defaulters", defaultData);

  await prisma.prediction.createMany({
    data: defaultData,
    skipDuplicates: true,
  });
}

export async function addDefaultersForCompletedMatch(
  match: Match,
  defaulters: { id: string }[]
) {
  defaulters.forEach(
    async (user) =>
      await prisma.user.update({
        where: { id: user.id },
        data: {
          balance: { decrement: match.minStake },
          predictions: {
            upsert: {
              where: { matchId_userId: { matchId: match.id, userId: user.id } },
              create: {
                matchId: match.id,
                amount: match.minStake,
                result: -match.minStake,
                status: PredictionStatus.LOST,
              },
              update: {
                amount: match.minStake,
                result: -match.minStake,
                status: PredictionStatus.LOST,
              },
            },
          },
        },
      })
  );
}

export async function getWinnersForAbandonedMatch(
  matchId: string
): Promise<PredReturnType[]> {
  return await prisma.prediction.findMany({
    where: { matchId, status: PredictionStatus.PLACED },
    select: PRED_VALUES,
  });
}

export async function getWinnersForCompletedMatch(
  match: Match
): Promise<PredReturnType[]> {
  return await prisma.prediction.findMany({
    where: { matchId: match.id, teamId: match.winnerId },
    select: PRED_VALUES,
  });
}

export async function getLosersForCompletedMatch(
  match: Match
): Promise<PredReturnType[]> {
  return await prisma.prediction.findMany({
    where: { matchId: match.id, NOT: { teamId: match.winnerId } },
    select: PRED_VALUES,
  });
}

export async function addLosingBetForMatch(
  match: Match,
  defaulters: { id: string }[]
) {
  defaulters.forEach(
    async (user) =>
      await prisma.user.update({
        where: { id: user.id },
        data: {
          balance: { decrement: match.minStake },
          predictions: {
            upsert: {
              where: { matchId_userId: { matchId: match.id, userId: user.id } },
              create: {
                matchId: match.id,
                amount: match.minStake,
                result: -match.minStake,
                status: PredictionStatus.LOST,
              },
              update: {
                amount: match.minStake,
                result: -match.minStake,
                status: PredictionStatus.LOST,
              },
            },
          },
        },
      })
  );
}
export async function addLosingBetForCompletedMatch(losers: PredReturnType[]) {
  losers.forEach(
    async (pred) =>
      await prisma.user.update({
        where: { id: pred.userId },
        data: {
          balance: { decrement: pred.amount },
          predictions: {
            update: {
              where: { id: pred.id },
              data: {
                result: -pred.amount,
                status: PredictionStatus.LOST,
              },
            },
          },
        },
      })
  );
}

export async function addWinningBetForMatch(
  winners: PredReturnType[],
  totalWon: number,
  totalLost: number
) {
  winners.forEach(
    async (pred) =>
      await prisma.user.update({
        where: { id: pred.userId },
        data: {
          balance: { increment: (pred.amount / totalWon) * totalLost },
          predictions: {
            update: {
              where: { id: pred.id },
              data: {
                result: (pred.amount / totalWon) * totalLost,
                status: PredictionStatus.WON,
              },
            },
          },
        },
      })
  );
}

export async function updateNoResultForMatch(match: Match) {
  await prisma.prediction.updateMany({
    where: { matchId: match.id },
    data: { status: PredictionStatus.NORESULT },
  });
}

export async function insertToHistory(match: Match) {
  await prisma.matchHistory.create({
    data: {
      date: match.date.slice(0, 10),
      status: match.status,
      venue: match.venue,
      result: match.result,
      team1Id: match.team1Id,
      team2Id: match.team2Id,
      winnerId: match.winnerId,
    },
  });
}

export async function updateTeamsForAbandonedMatch(match: Match) {
  await prisma.match.update({
    where: { id: match.id },
    data: {
      team1: {
        update: {
          where: { id: match.team1Id! },
          data: {
            played: { increment: 1 },
            points: { increment: 1 },
            draw: { increment: 1 },
          },
        },
      },
      team2: {
        update: {
          where: { id: match.team2Id! },
          data: {
            played: { increment: 1 },
            points: { increment: 1 },
            draw: { increment: 1 },
          },
        },
      },
    },
  });
}

export async function updateTeamsForCompletedMatch(match: Match) {
  const nrr1 = await computeNrrForTeam(match, match.team1Id!);
  const nrr2 = await computeNrrForTeam(match, match.team2Id!);

  return await prisma.match.update({
    where: { id: match.id },
    data: {
      team1: {
        update: {
          where: { id: match.team1Id! },
          data: {
            played: { increment: 1 },
            won: {
              increment: match.winnerId === match.team1Id ? 1 : 0,
            },
            points: {
              increment: match.winnerId === match.team1Id ? 2 : 0,
            },
            lost: {
              increment: match.winnerId === match.team2Id ? 1 : 0,
            },
            forRuns: { increment: match.team1Runs },
            forOvers: {
              increment: match.team1Wickets === 10 ? 20.0 : match.team1Overs,
            },
            againstRuns: { increment: match.team2Runs },
            againstOvers: {
              increment: match.team2Wickets === 10 ? 20.0 : match.team2Overs,
            },
            nrr: nrr1,
          },
        },
      },
      team2: {
        update: {
          where: { id: match.team2Id! },
          data: {
            played: { increment: 1 },
            won: {
              increment: match.winnerId === match.team2Id ? 1 : 0,
            },
            points: {
              increment: match.winnerId === match.team2Id ? 2 : 0,
            },
            lost: {
              increment: match.winnerId === match.team1Id ? 1 : 0,
            },
            forRuns: { increment: match.team2Runs },
            forOvers: {
              increment: match.team2Wickets === 10 ? 20.0 : match.team2Overs,
            },
            againstRuns: { increment: match.team1Runs },
            againstOvers: {
              increment: match.team1Wickets === 10 ? 20.0 : match.team1Overs,
            },
            nrr: nrr2,
          },
        },
      },
    },
  });
}

export async function computeNrrForTeam(match: Match, teamId: string) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
  });

  const forRuns =
    (team!.forRuns ?? 0) +
    (teamId === match.team1Id ? match.team1Runs : match.team2Runs);
  const forOvers =
    (team!.forOvers ?? 0) +
    (teamId === match.team1Id && match.team1Wickets === 10
      ? 20.0
      : teamId === match.team1Id
      ? match.team1Overs
      : teamId === match.team2Id && match.team2Wickets === 10
      ? 20.0
      : match.team2Overs);
  const againstRuns =
    (team!.againstRuns ?? 0) +
    (teamId === match.team1Id ? match.team2Runs : match.team1Runs);
  const againstOvers =
    (team!.againstOvers ?? 0) +
    (teamId === match.team1Id && match.team2Wickets === 10
      ? 20.0
      : teamId === match.team1Id
      ? match.team2Overs
      : teamId === match.team2Id && match.team1Wickets === 10
      ? 20.0
      : match.team1Overs);

  return computeNrr(forOvers, forRuns, againstOvers, againstRuns);
}
