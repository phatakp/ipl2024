import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string({
    required_error: "Password is required",
  }),
});

export const NewUserSchema = z
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

export type NewUserType = z.infer<typeof NewUserSchema>;
export type LoginUserData = z.infer<typeof LoginSchema>;
