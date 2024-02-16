import { getMatchStats } from "@/actions/stats.actions";
import { useQuery } from "@tanstack/react-query";

export const useTeamStats = (
  team1Id: string | null,
  team2Id: string | null,
  isOpen: boolean = false
) => {
  return useQuery({
    queryKey: ["teamStats", team1Id, team2Id],
    queryFn: () => getMatchStats(team1Id, team2Id),
    enabled: isOpen && !!team1Id && !!team2Id,
  });
};
