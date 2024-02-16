import { getUserLast5 } from "@/actions/user.actions";
import { useQuery } from "@tanstack/react-query";

export const useUserFormGuide = (userId: string) => {
  return useQuery({
    queryKey: ["userFormGuide", userId],
    queryFn: () => getUserLast5(userId),
    enabled: !!userId,
  });
};
