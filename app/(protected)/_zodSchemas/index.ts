import { z } from "zod";

export const ProfileSchema = z.object({
  firstName: z.string().min(2, {
    message: "First Name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "First Name must be at least 2 characters.",
  }),
  teamId: z.string({ required_error: "Team is required" }),
  userId: z.string({ required_error: "You are not authenticated" }),
});

export const PredictionSchema = z.object({
  userId: z.string({ required_error: "You are not authenticated" }),
  matchId: z.string({ required_error: "Match is required" }),
  amount: z.number(),
  teamId: z.string({ required_error: "Team is required" }),
  isDouble: z.boolean(),
});

export type ProfileData = z.infer<typeof ProfileSchema>;
export type PredictionData = z.infer<typeof PredictionSchema>;
