import { getMatchPredictions } from "@/actions/prediction.actions";
import { useQuery } from "@tanstack/react-query";

export const useMatchPredictions = (
  matchId: string | undefined,
  userId: string | undefined
) => {
  return useQuery({
    queryKey: ["matchPredictions", matchId],
    queryFn: () => getMatchPredictions(matchId!),
    enabled: !!matchId && !!userId,
  });
};
