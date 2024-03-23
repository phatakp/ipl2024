import { getTeamLast5 } from "@/actions/team.actions";
import { Prediction } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export const useFormGuide = (data?: Prediction[], id?: string) => {
  if (!!id)
    return useQuery({
      queryKey: ["teamFormGuide", id],
      queryFn: () => getTeamLast5(id),
      enabled: !!id,
      staleTime: 50000,
    });
  else return { data, isLoading: false };
  // return useQuery({
  //   queryKey: ["userFormGuide", id],
  //   queryFn: () => getUserLast5(id),
  //   enabled: !!id,
  //   staleTime: 50000,
  // });
};
