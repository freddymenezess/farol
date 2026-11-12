import { z } from "zod"

export const loginSchema = z.object({
  email: z.email("INVALID_EMAIL_ADRESS"),
  password: z.string().nonempty("PASSWORD_REQUIRED"),
})

export const registerSchema = z.object({
  email: z.email("INVALID_EMAIL_ADDRESS"),
  firstPassword: z.string().min(8, "TOO_SMALL"),
  secondPassword: z.string().min(8, "TOO_SMALL"),
}).refine((data) => data.firstPassword === data.secondPassword, {
  path: ["secondPassword"],
  message: "PASSWORD_NO_MATCH",
})
