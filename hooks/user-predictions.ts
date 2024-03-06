import { getUserPredictions } from "@/actions/prediction.actions";
import { useQuery } from "@tanstack/react-query";

export function useUserPredictions(userId: string | undefined) {
  return useQuery({
    queryKey: ["userPredictions", userId],
    queryFn: () => getUserPredictions(userId!),
    enabled: !!userId,
    staleTime: 5000,
  });
}
