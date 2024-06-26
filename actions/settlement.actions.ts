import { prisma } from "@/lib/db";
import { computeNrr, transformOvers } from "@/lib/utils";
import { Match, PredictionStatus } from "@prisma/client";

export type PredReturnType = {
  id: string;
  amount: number;
  userId: string;
  isDouble: boolean;
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

  await prisma.prediction.createMany({
    data: defaultData,
    skipDuplicates: true,
  });
}

export async function addDefaultersForCompletedMatch({
  match,
  defaulters,
  isDouble,
}: {
  match: Match;
  defaulters: { id: string }[];
  isDouble: boolean;
}) {
  defaulters.forEach(
    async (user) =>
      await prisma.user.update({
        where: { id: user.id },
        data: {
          balance: {
            decrement: isDouble ? 2 * match.minStake : match.minStake,
          },
          predictions: {
            upsert: {
              where: { matchId_userId: { matchId: match.id, userId: user.id } },
              create: {
                matchId: match.id,
                amount: match.minStake,
                result: isDouble ? -2 * match.minStake : -match.minStake,
                status: PredictionStatus.LOST,
              },
              update: {
                amount: match.minStake,
                result: isDouble ? -2 * match.minStake : -match.minStake,
                status: PredictionStatus.LOST,
              },
            },
          },
        },
      })
  );
}

export async function settleLosersForAbandonedMatch({
  match,
  defaulters,
}: {
  match: Match;
  defaulters: { id: string }[];
}) {
  defaulters.forEach(
    async (user) =>
      await prisma.user.update({
        where: { id: user.id },
        data: {
          balance: {
            decrement: match.minStake,
          },
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
export async function settleLosersForCompletedMatch({
  losers,
  isDouble,
}: {
  losers: PredReturnType[];
  isDouble: boolean;
}) {
  losers.forEach(
    async (pred) =>
      await prisma.user.update({
        where: { id: pred.userId },
        data: {
          balance: {
            decrement: isDouble ? 2 * pred.amount : pred.amount,
          },
          predictions: {
            update: {
              where: { id: pred.id },
              data: {
                result: isDouble ? -2 * pred.amount : -pred.amount,
                status: PredictionStatus.LOST,
              },
            },
          },
        },
      })
  );
}

export async function settleWinnersForMatch({
  winners,
  totalWon,
  totalLost,
  isDouble,
}: {
  winners: PredReturnType[];
  totalWon: number;
  totalLost: number;
  isDouble: boolean;
}) {
  winners.forEach(
    async (pred) =>
      await prisma.user.update({
        where: { id: pred.userId },
        data: {
          balance: {
            increment:
              isDouble && pred.isDouble
                ? totalLost + (pred.amount / totalWon) * totalLost
                : (pred.amount / totalWon) * totalLost,
          },
          predictions: {
            update: {
              where: { id: pred.id },
              data: {
                result:
                  isDouble && pred.isDouble
                    ? totalLost + (pred.amount / totalWon) * totalLost
                    : (pred.amount / totalWon) * totalLost,
                status: PredictionStatus.WON,
              },
            },
          },
        },
      })
  );
}

export async function updateNoResultForMatch({ match }: { match: Match }) {
  await prisma.prediction.updateMany({
    where: { matchId: match.id },
    data: { status: PredictionStatus.NORESULT },
  });
}

export async function insertToHistory({ match }: { match: Match }) {
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

export async function updateTeamsForAbandonedMatch({
  match,
}: {
  match: Match;
}) {
  await prisma.team.updateMany({
    where: { OR: [{ id: match.team1Id! }, { id: match.team2Id! }] },
    data: {
      played: { increment: 1 },
      points: { increment: 1 },
      draw: { increment: 1 },
    },
  });
}

export async function updateTeamsForCompletedMatch({
  match,
}: {
  match: Match;
}) {
  const {
    nrr: nrr1,
    forOvers: for1,
    againstOvers: against1,
  } = await computeNrrForTeam(match, match.team1Id!);
  const {
    nrr: nrr2,
    forOvers: for2,
    againstOvers: against2,
  } = await computeNrrForTeam(match, match.team2Id!);

  await prisma.team.update({
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
      forOvers: parseFloat(for1),
      againstRuns: { increment: match.team2Runs },
      againstOvers: parseFloat(against1),
      nrr: nrr1,
    },
  });

  await prisma.team.update({
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
      forOvers: parseFloat(for2),
      againstRuns: { increment: match.team1Runs },
      againstOvers: parseFloat(against2),
      nrr: nrr2,
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

  return {
    nrr: computeNrr(forOvers, forRuns, againstOvers, againstRuns),
    forOvers: transformOvers(forOvers.toFixed(1)),
    againstOvers: transformOvers(againstOvers.toFixed(1)),
  };
}

export async function updateNoIPLWinner() {
  await prisma.prediction.updateMany({
    where: { matchId: null },
    data: { status: PredictionStatus.NORESULT },
  });
}
