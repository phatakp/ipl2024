import { getTeamsInfo } from "@/actions/team.actions";
import { useQuery } from "@tanstack/react-query";

export const useTeamOptions = () => {
  return useQuery({
    queryKey: ["teamOptions"],
    queryFn: () => getTeamsInfo(),
  });
};
