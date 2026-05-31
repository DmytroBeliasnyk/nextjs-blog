import z from "zod";

export const SignUpSchema = z.object({
  name: z.string().min(3).max(30),
  email: z.email(),
  password: z.string().min(8).max(30),
});

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(30),
});
