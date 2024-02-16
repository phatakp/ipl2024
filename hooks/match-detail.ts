import { getMatchById } from "@/actions/match.actions";
import { useQuery } from "@tanstack/react-query";

export const useMatchDetail = (matchId: string | undefined) => {
  return useQuery({
    queryKey: ["matchDetail", matchId],
    queryFn: () => getMatchById(matchId!),
    enabled: !!matchId,
  });
};
