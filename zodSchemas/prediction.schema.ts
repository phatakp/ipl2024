import { z } from "zod";

export const PredictionFormSchema = z.object({
  userId: z.string({ required_error: "You are not authenticated" }),
  matchId: z.string({ required_error: "Match is required" }),
  amount: z.number(),
  teamId: z.string({ required_error: "Team is required" }),
  isDouble: z.boolean(),
});

export type PredictionFormData = z.infer<typeof PredictionFormSchema>;
