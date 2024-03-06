import { getTeamLast5 } from "@/actions/team.actions";
import { getUserLast5 } from "@/actions/user.actions";
import { useQuery } from "@tanstack/react-query";

export const useFormGuide = (type: "team" | "user", id: string) => {
  if (type === "team")
    return useQuery({
      queryKey: ["teamFormGuide", id],
      queryFn: () => getTeamLast5(id),
      enabled: !!id,
      staleTime: 50000,
    });
  else
    return useQuery({
      queryKey: ["userFormGuide", id],
      queryFn: () => getUserLast5(id),
      enabled: !!id,
      staleTime: 50000,
    });
};
