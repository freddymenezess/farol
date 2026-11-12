"use server"

import { z } from "zod"
import { hasLocale } from "next-intl"
import { routing } from "@/i18n/routing"
import { createClient } from "@/lib/supabase/server"
import { registerSchema } from "@/lib/validators/auth"
import { redirect } from "@/i18n/navigation"
import type { RegisterState } from "@/types/auth"

export async function signupAction(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    firstPassword: formData.get("firstPassword"),
    secondPassword: formData.get("secondPassword"),
  })

  if (!parsed.success) {
    return { success: false, error: z.flattenError(parsed.error).fieldErrors, values: {
        email: String(formData.get("email") ?? "")
      } 
    }
  }

  const { email, firstPassword } = parsed.data

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: email,
    password: firstPassword,
  })

  if (error) {
    console.error("Falha ao criar conta:", error.message)
    return { success: false, error: { signup: ["REGISTRATION_FAILED"] }, values: { email } }
  }

  const rawLocale = formData.get("locale")
  const locale = hasLocale(routing.locales, rawLocale)
    ? rawLocale
    : routing.defaultLocale

  redirect({ href: "up/choose-paper", locale })
}
