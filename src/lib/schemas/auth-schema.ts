import { z } from "zod"

export const loginSchema = z.object({
  email: z.email("INVALID_EMAIL_ADDRESS"),
  password: z.string().nonempty("PASSWORD_REQUIRED"),
})

export const registerSchema = z
  .object({
    email: z.email("INVALID_EMAIL_ADDRESS"),
    password: z.string().min(8, "TOO_SMALL"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "PASSWORD_NO_MATCH",
  })

export const resetSchema = z
  .object({
    password: z.string().min(8, "TOO_SMALL"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "PASSWORD_NO_MATCH",
    path: ["password"]
  })

