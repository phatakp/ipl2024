import { getUserPredictionForMatch } from "@/actions/prediction.actions";
import { useQuery } from "@tanstack/react-query";

export function useUserPredictionForMatch(
  userId: string | undefined,
  matchId: string
) {
  return useQuery({
    queryKey: ["userMatchPrediction", userId, matchId],
    queryFn: () => getUserPredictionForMatch(userId, matchId),
    enabled: !!userId && !!matchId,
    staleTime: 5000,
  });
}
