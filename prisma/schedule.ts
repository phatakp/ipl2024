import { MatchInput } from "@/types";
import { MatchStatus, MatchType } from "@prisma/client";
import { DateTime } from "luxon";
import { getTeams, prisma } from ".";
import matches from "./matches.json";

export async function loadMatches() {
  // await prisma.match.deleteMany();
  const teams = await getTeams();
  const data: MatchInput[] = [];

  matches.Matchsummary.forEach((match, i) => {
    const date = new Date(match.MatchDate);
    if (date > new Date("2024-04-07")) {
      const team1Id = teams.find(
        (team) => team.shortName === match.FirstBattingTeamCode
      )?.id;
      const team2Id = teams.find(
        (team) => team.shortName === match.SecondBattingTeamCode
      )?.id;
      if (!team1Id || !team2Id)
        console.log(
          "Match not created for",
          match.FirstBattingTeamCode,
          match.SecondBattingTeamCode,
          match.MATCH_COMMENCE_START_DATE,
          match.MatchOrder
        );
      else {
        // throw new Error(
        //   `Invalid teams ${match.FirstBattingTeamCode} ${match.SecondBattingTeamCode}`
        // );
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
          // team1Runs: randomNumberBetween(150, 200),
          // team1Wickets: randomNumberBetween(1, 10),
          // team1Overs: randomNumberBetween(18, 20),
          // team2Runs: randomNumberBetween(150, 200),
          // team2Wickets: randomNumberBetween(1, 10),
          // team2Overs: randomNumberBetween(18, 20),
          team1Runs: 0,
          team1Wickets: 0,
          team1Overs: 0,
          team2Runs: 0,
          team2Wickets: 0,
          team2Overs: 0,
          isDoublePlayed: false,
        };
        data.push(matchCurr);
      }
    }
  });
  await prisma.match.createMany({ data });
}
