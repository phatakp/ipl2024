import { getUserPredictions } from "@/actions/prediction";
import { useQuery } from "@tanstack/react-query";

export const useUserPredictions = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["userPredictions", userId],
    queryFn: () => getUserPredictions(userId!),
    enabled: !!userId,
  });
};
