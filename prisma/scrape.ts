import { MatchHistoryInput } from "@/types";
import { MatchStatus, Team } from "@prisma/client";
import { JSDOM } from "jsdom";
import { prisma } from ".";

export async function getTeams() {
  const teams = await prisma.team.findMany();
  return teams;
}

export function getTeam(teams: Team[], name: string) {
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
  const teams = await getTeams();
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
      let d;
      if (dt.includes("-")) {
        d = dt.split("-")[0] + "," + dt.split("-")[1].split(",")[1];
      }
      const date = new Date(d ?? dt);

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
      }
    }
  });
  await prisma.matchHistory.deleteMany();
  await prisma.matchHistory.createMany({ data });
};
