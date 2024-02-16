import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string({
    required_error: "Password is required",
  }),
});

export const RegisterSchema = z
  .object({
    email: z.string().email({
      message: "Email is required",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    password2: z.string().min(8, {
      message: "Confirm Password must be at least 8 characters.",
    }),
  })
  .refine(
    (data) => {
      return data.password === data.password2;
    },
    { message: "Passwords don't match", path: ["password2"] }
  );

export const ProfileFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First Name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "First Name must be at least 2 characters.",
  }),
  teamId: z.string({ required_error: "Team is required" }),
  userId: z.string({ required_error: "You are not authenticated" }),
});

export type RegisterFormData = z.infer<typeof RegisterSchema>;
export type LoginFormData = z.infer<typeof LoginSchema>;
export type ProfileFormData = z.infer<typeof ProfileFormSchema>;
