import { getTeamLast5 } from "@/actions/team.actions";
import { useQuery } from "@tanstack/react-query";

export const useTeamFormGuide = (teamId: string) => {
  return useQuery({
    queryKey: ["teamFormGuide", teamId],
    queryFn: () => getTeamLast5(teamId),
    enabled: !!teamId,
  });
};
