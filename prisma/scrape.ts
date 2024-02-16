import { MatchHistoryInput, MatchInput } from "@/types";
import { MatchStatus, MatchType, PrismaClient, Team } from "@prisma/client";
import { JSDOM } from "jsdom";
import { DateTime } from "luxon";
const prisma = new PrismaClient();

async function getTeams() {
  const teams = await prisma.team.findMany();
  return teams;
}

function getTeam(teams: Team[], name: string) {
  if (name === "Daredevils")
    return teams.find((team) => team.shortName === "DC");
  if (name === "Kings XI")
    return teams.find((team) => team.shortName === "PBKS");
  if (name === "Chargers")
    return teams.find((team) => team.shortName === "SRH");
  return teams.find(
    (team) => team.longName.includes(name) || team.shortName === name
  );
}

export const loadHistory = async () => {
  const resp = await fetch(
    "https://www.espncricinfo.com/records/trophy/team-match-results/indian-premier-league-117"
  );

  const html = await resp.text();
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const matches = document.querySelectorAll("table tr");
  const data: MatchHistoryInput[] = [];
  const mdata: MatchInput[] = [];
  const teams = await getTeams();
  let num = 1;
  matches.forEach((match, i) => {
    if (i > 0) {
      const details = match.querySelectorAll("td");
      let team1 = "";
      let team2 = "";
      let winner = "";
      let margin = "";
      let venue = "";
      let dt = "";
      details.forEach((field, j) => {
        switch (j) {
          case 0:
            team1 = field.textContent as string;
            break;
          case 1:
            team2 = field.textContent as string;
            break;
          case 2:
            winner = field.textContent as string;
            break;
          case 3:
            margin = field.textContent as string;
            break;
          case 4:
            venue = field.textContent as string;
            break;
          case 5:
            dt = field.textContent as string;
            break;
          default:
            break;
        }
      });
      const homeId = getTeam(teams, team1)?.id;
      const awayId = getTeam(teams, team2)?.id;
      const winId = getTeam(teams, winner)?.id;
      const date = new Date(dt);

      if (!!homeId && !!awayId) {
        const matchHistory = {
          date: date.toISOString().slice(0, 10),
          team1Id: homeId ?? null,
          team2Id: awayId ?? null,
          winnerId: winId ?? null,
          venue,
          result: margin,
          status: !!winId ? MatchStatus.COMPLETED : MatchStatus.ABANDONED,
        };
        data.push(matchHistory);

        if (date.getFullYear() === 2023) {
          const date = new Date();
          date.setDate(date.getDate() + i);
          date.setHours(19);
          date.setMinutes(30);
          date.setSeconds(0);
          const istDate = DateTime.fromISO(date.toISOString())
            .setZone("Asia/Kolkata")
            .toISO();

          const matchCurr = {
            num,
            team1Id: homeId ?? null,
            team2Id: awayId ?? null,
            date: istDate!,
            venue,
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
            doublePlayed: false,
          };
          mdata.push(matchCurr);
          num++;
        }
      }
    }
  });
  // await prisma.matchHistory.deleteMany();
  // await prisma.matchHistory.createMany({ data });
  await prisma.match.deleteMany();
  await prisma.match.createMany({ data: mdata });
};
