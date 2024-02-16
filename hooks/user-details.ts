import { getUsers } from "@/actions/user.actions";
import { useQuery } from "@tanstack/react-query";

export const useUserDetails = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });
};
