import { prisma } from "@/lib/db";
import { MatchHistoryAPIResult, StatsResult } from "@/types";
import { MatchStatus } from "@prisma/client";
import { INCLUDE_MATCH_DETAILS } from ".";

export async function getMatchStats(
  team1Id: string | null,
  team2Id: string | null
) {
  if (!team1Id || !team2Id) return null;
  const result: StatsResult = {
    t1vst2_AllMatches: 0,
    t1vst2_AllWins: 0,
    t1vst2_WinPct: 0,
    t2vst1_AllWins: 0,
    t2vst1_WinPct: 0,
    t1vst2_HomeMatches: 0,
    t1vst2_AwayMatches: 0,
    t1vst2_HomeWins: 0,
    t1vst2_HomeWinPct: 0,
    t1vst2_AwayWins: 0,
    t1vst2_AwayWinPct: 0,
    t2vst1_HomeWins: 0,
    t2vst1_HomeWinPct: 0,
    t2vst1_AwayWins: 0,
    t2vst1_AwayWinPct: 0,
    t1_AllMatches: 0,
    t1_AllWins: 0,
    t1_AllWinPct: 0,
    t1_HomeMatches: 0,
    t1_HomeWins: 0,
    t1_HomeWinPct: 0,
    t2_HomeMatches: 0,
    t2_HomeWins: 0,
    t2_HomeWinPct: 0,
    t2_AllMatches: 0,
    t2_AllWins: 0,
    t2_AllWinPct: 0,
    t1_AwayMatches: 0,
    t1_AwayWins: 0,
    t1_AwayWinPct: 0,
    t2_AwayMatches: 0,
    t2_AwayWins: 0,
    t2_AwayWinPct: 0,
    t1_WinPct: 0,
    t2_WinPct: 0,
    pct: 0,
    recentBetween: [] as MatchHistoryAPIResult[],
    t1_last5: [] as MatchHistoryAPIResult[],
    t2_last5: [] as MatchHistoryAPIResult[],
  };

  // Last 5 matches between teams
  result.recentBetween = await prisma.matchHistory.findMany({
    where: {
      OR: [
        { team1Id, team2Id },
        { team1Id: team2Id, team2Id: team1Id },
      ],
    },
    include: INCLUDE_MATCH_DETAILS,
    orderBy: [{ date: "desc" }],
    take: 5,
  });

  // Last 5 matches team1
  result.t1_last5 = await prisma.matchHistory.findMany({
    where: {
      OR: [{ team1Id }, { team2Id: team1Id }],
    },
    include: INCLUDE_MATCH_DETAILS,
    orderBy: [{ date: "desc" }],
    take: 5,
  });

  // Last 5 matches team2
  result.t2_last5 = await prisma.matchHistory.findMany({
    where: {
      OR: [{ team2Id }, { team1Id: team2Id }],
    },
    include: INCLUDE_MATCH_DETAILS,
    orderBy: [{ date: "desc" }],
    take: 5,
  });

  // Count all home / away matches between the teams
  const groupMatchesBetween = await prisma.matchHistory.groupBy({
    by: ["team1Id", "team2Id"],
    where: {
      status: MatchStatus.COMPLETED,
    },
    _count: true,
  });

  result.t1vst2_HomeMatches = groupMatchesBetween
    .filter((obj) => obj.team1Id === team1Id && obj.team2Id === team2Id)
    .reduce((a, b) => a + b._count, 0);
  result.t1vst2_AwayMatches = groupMatchesBetween
    .filter((obj) => obj.team1Id === team2Id && obj.team2Id === team1Id)
    .reduce((a, b) => a + b._count, 0);
  result.t1vst2_AllMatches =
    result.t1vst2_HomeMatches + result.t1vst2_AwayMatches;

  // Count all matches for teams
  const groupMatchesAll = await prisma.matchHistory.groupBy({
    by: ["team1Id", "team2Id"],
    where: {
      status: MatchStatus.COMPLETED,
    },
    _count: true,
  });

  result.t1_AllMatches = groupMatchesAll
    .filter((obj) => obj.team1Id === team1Id || obj.team2Id === team1Id)
    .reduce((a, b) => a + b._count, 0);
  result.t2_AllMatches = groupMatchesAll
    .filter((obj) => obj.team1Id === team2Id || obj.team2Id === team2Id)
    .reduce((a, b) => a + b._count, 0);

  result.t1_HomeMatches = groupMatchesAll
    .filter((obj) => obj.team1Id === team1Id)
    .reduce((a, b) => a + b._count, 0);
  result.t1_AwayMatches = groupMatchesAll
    .filter((obj) => obj.team2Id === team1Id)
    .reduce((a, b) => a + b._count, 0);
  result.t2_HomeMatches = groupMatchesAll
    .filter((obj) => obj.team1Id === team2Id)
    .reduce((a, b) => a + b._count, 0);
  result.t2_AwayMatches = groupMatchesAll
    .filter((obj) => obj.team2Id === team2Id)
    .reduce((a, b) => a + b._count, 0);

  // Count all wins (home/away) between the teams
  const groupedWins = await prisma.matchHistory.groupBy({
    by: ["team1Id", "team2Id", "winnerId"],
    where: {
      status: MatchStatus.COMPLETED,
    },
    _count: true,
  });

  result.t1vst2_HomeWins =
    groupedWins.find(
      (obj) =>
        obj.team1Id === team1Id &&
        obj.team2Id === team2Id &&
        obj.winnerId === team1Id
    )?._count ?? 0;
  result.t1vst2_AwayWins =
    groupedWins.find(
      (obj) =>
        obj.team1Id === team2Id &&
        obj.team2Id === team1Id &&
        obj.winnerId === team1Id
    )?._count ?? 0;
  result.t2vst1_HomeWins =
    groupedWins.find(
      (obj) =>
        obj.team1Id === team2Id &&
        obj.team2Id === team1Id &&
        obj.winnerId === team2Id
    )?._count ?? 0;
  result.t2vst1_AwayWins =
    groupedWins.find(
      (obj) =>
        obj.team1Id === team1Id &&
        obj.team2Id === team2Id &&
        obj.winnerId === team2Id
    )?._count ?? 0;

  result.t1_HomeWins = groupedWins
    .filter((obj) => obj.team1Id === team1Id && obj.winnerId === team1Id)
    .reduce((a, b) => a + b._count, 0);
  result.t1_AwayWins = groupedWins
    .filter((obj) => obj.team2Id === team1Id && obj.winnerId === team1Id)
    .reduce((a, b) => a + b._count, 0);
  result.t2_HomeWins = groupedWins
    .filter((obj) => obj.team1Id === team2Id && obj.winnerId === team2Id)
    .reduce((a, b) => a + b._count, 0);
  result.t2_AwayWins = groupedWins
    .filter((obj) => obj.team2Id === team2Id && obj.winnerId === team2Id)
    .reduce((a, b) => a + b._count, 0);

  result.t1_AllWins = groupedWins
    .filter((obj) => obj.winnerId === team1Id)
    .reduce((a, b) => a + b._count, 0);
  result.t2_AllWins = groupedWins
    .filter((obj) => obj.winnerId === team2Id)
    .reduce((a, b) => a + b._count, 0);

  result.t1vst2_AllWins = groupedWins
    .filter(
      (obj) =>
        obj.winnerId === team1Id &&
        ((obj.team1Id === team1Id && obj.team2Id === team2Id) ||
          (obj.team1Id === team2Id && obj.team2Id === team1Id))
    )
    .reduce((a, b) => a + b._count, 0);
  result.t2vst1_AllWins = groupedWins
    .filter(
      (obj) =>
        obj.winnerId === team2Id &&
        ((obj.team1Id === team1Id && obj.team2Id === team2Id) ||
          (obj.team1Id === team2Id && obj.team2Id === team1Id))
    )
    .reduce((a, b) => a + b._count, 0);

  result.t1vst2_WinPct = result.t1vst2_AllWins / result.t1vst2_AllMatches;
  result.t2vst1_WinPct = result.t2vst1_AllWins / result.t1vst2_AllMatches;
  result.t1vst2_HomeWinPct = result.t1vst2_HomeWins / result.t1vst2_HomeMatches;
  result.t1vst2_AwayWinPct = result.t1vst2_AwayWins / result.t1vst2_AwayMatches;
  result.t2vst1_HomeWinPct = result.t2vst1_HomeWins / result.t1vst2_AwayMatches;
  result.t2vst1_AwayWinPct = result.t2vst1_AwayWins / result.t1vst2_HomeMatches;
  result.t1_AllWinPct = result.t1_AllWins / result.t1_AllMatches;
  result.t2_AllWinPct = result.t2_AllWins / result.t2_AllMatches;
  result.t1_HomeWinPct = result.t1_HomeWins / result.t1_HomeMatches;
  result.t1_AwayWinPct = result.t1_AwayWins / result.t1_AwayMatches;
  result.t2_HomeWinPct = result.t2_HomeWins / result.t2_HomeMatches;
  result.t2_AwayWinPct = result.t2_AwayWins / result.t2_AwayMatches;

  result.t1_WinPct =
    (2 * result.t1_AllWinPct +
      2 * result.t1_HomeWinPct +
      3 * result.t1vst2_WinPct +
      3 * result.t1vst2_HomeWinPct) /
    10;
  result.t2_WinPct =
    (2 * result.t2_AllWinPct +
      2 * result.t2_AwayWinPct +
      3 * result.t2vst1_WinPct +
      3 * result.t2vst1_AwayWinPct) /
    10;
  result.pct = Math.floor(result.t1_WinPct * 100);
  return result;
}
