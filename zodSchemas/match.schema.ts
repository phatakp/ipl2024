import {
  isValidBatFirst,
  isValidStatus,
  isValidT1Overs,
  isValidT1Score,
  isValidT2Overs,
  isValidT2Score,
  isValidWinner,
} from "@/lib/validators/match.validators";
import { MatchStatus } from "@prisma/client";
import { z } from "zod";

export const UpdateMatchFormSchema = z
  .object({
    matchId: z.string({ required_error: "Match is required" }),
    status: z.nativeEnum(MatchStatus),
    t1Score: z
      .string()
      .refine((val) => val.includes("/"), { message: "Invalid Score Format" }),
    t1Overs: z.string().min(0, "Min value 0").max(20, "Max value is 20"),
    t2Score: z
      .string()
      .refine((val) => val.includes("/"), { message: "Invalid Score Format" }),
    t2Overs: z.string().min(0, "Min value 0").max(20, "Max value is 20"),

    batFirstId: z.string().optional(),
    winnerId: z.string().optional(),
  })
  .refine((data) => isValidBatFirst(data.batFirstId, data.status), {
    message: "Batting First required",
    path: ["batFirstId"],
  })
  .refine((data) => isValidWinner(data.winnerId, data.status), {
    message: "Winner required",
    path: ["winnerId"],
  })
  .refine((data) => isValidStatus(data.winnerId, data.status), {
    message: "Invalid Status",
    path: ["status"],
  })
  .refine(
    (data) =>
      isValidT1Score(data.t1Score, data.status) &&
      isValidT1Overs(data.t1Overs, data.status),
    {
      message: "Invalid Team1 Score",
      path: ["t1Score"],
    }
  )
  .refine(
    (data) =>
      isValidT2Score(data.t2Score, data.status) &&
      isValidT2Overs(data.t2Overs, data.status),
    {
      message: "Invalid Team2 Score",
      path: ["t2Score"],
    }
  )
  .refine(
    (data) =>
      isValidT1Score(data.t1Score, data.status) &&
      isValidT1Overs(data.t1Overs, data.status),
    {
      message: "Invalid Team1 Overs",
      path: ["t1Overs"],
    }
  )
  .refine(
    (data) =>
      isValidT2Score(data.t2Score, data.status) &&
      isValidT2Overs(data.t2Overs, data.status),
    {
      message: "Invalid Team2 Overs",
      path: ["t2Overs"],
    }
  );

export type UpdateMatchFormData = z.infer<typeof UpdateMatchFormSchema>;
