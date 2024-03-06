import { MatchHistoryInput } from "@/types";
import { MatchStatus } from "@prisma/client";
import { getTeams, prisma } from ".";
import history from "./history.json";

export async function loadHistory() {
  await prisma.matchHistory.deleteMany();
  const data: MatchHistoryInput[] = [];
  const teams = await getTeams();

  history.forEach((match) => {
    const team1Id =
      teams.find((team) => team.shortName === match.team1)?.id ?? null;
    const team2Id =
      teams.find((team) => team.shortName === match.team2)?.id ?? null;
    const winnerId =
      teams.find((team) => team.shortName === match.winner)?.id ?? null;
    data.push({
      date: match.date,
      team1Id,
      team2Id,
      winnerId,
      venue: match.venue,
      result: match.result,
      status: match.status as MatchStatus,
    });
  });
  await prisma.matchHistory.createMany({ data });
}
