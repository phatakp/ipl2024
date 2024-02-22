import { MatchInput } from "@/types";
import { MatchStatus, MatchType, PrismaClient } from "@prisma/client";
import { DateTime } from "luxon";
import matches from "./matches.json";
import { getTeams } from "./scrape";
const prisma = new PrismaClient();

export async function loadMatches() {
  await prisma.match.deleteMany();
  const teams = await getTeams();
  const data: MatchInput[] = [];

  matches.Matchsummary.forEach((match, i) => {
    const team1Id = teams.find(
      (team) => team.shortName === match.FirstBattingTeamCode
    )?.id;
    const team2Id = teams.find(
      (team) => team.shortName === match.SecondBattingTeamCode
    )?.id;
    if (!team1Id || !team2Id)
      throw new Error(
        `Invalid teams ${match.FirstBattingTeamCode} ${match.SecondBattingTeamCode}`
      );
    const date = new Date(match.MATCH_COMMENCE_START_DATE);
    const [hr, min] = match.MatchTime.split(":");
    date.setHours(parseInt(hr));
    date.setMinutes(parseInt(min));
    date.setSeconds(0);
    const istDate = DateTime.fromISO(date.toISOString())
      .setZone("Asia/Kolkata")
      .toISO();
    const matchCurr = {
      num: i + 1,
      team1Id: team1Id ?? null,
      team2Id: team2Id ?? null,
      date: istDate!,
      venue: `${match.GroundName}, ${match.city}`,
      type: MatchType.LEAGUE,
      status: MatchStatus.SCHEDULED,
      batFirstId: null,
      winnerId: null,
      result: null,
      minStake: 50,
      team1Runs: 0,
      team1Wickets: 0,
      team1Overs: 0,
      team2Runs: 0,
      team2Wickets: 0,
      team2Overs: 0,
      isDoublePlayed: false,
    };
    data.push(matchCurr);
  });
  await prisma.match.deleteMany();
  await prisma.match.createMany({ data });
}
