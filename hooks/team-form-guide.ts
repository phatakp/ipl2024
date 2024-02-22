import { getTeamLast10 } from "@/actions/team.actions";
import { useQuery } from "@tanstack/react-query";

export const useTeamFormGuide = (teamId: string) => {
  return useQuery({
    queryKey: ["teamFormGuide", teamId],
    queryFn: () => getTeamLast10(teamId),
    enabled: !!teamId,
  });
};
