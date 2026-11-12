"use server"

import { hasLocale } from "next-intl"
import { routing } from "@/i18n/routing"
import { createClient } from "@/lib/supabase/server"
import { loginSchema } from "@/lib/validators/auth"
import { redirect } from "@/i18n/navigation"
import type { LoginState } from "@/types/auth"

export async function signinAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const next = String(formData.get("next") ?? "/dashboard")
  const email = String(formData.get("email") ?? "")

  const parsed = loginSchema.safeParse({
    email,
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return { success: false, error: "invalidCredentials", email }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    console.error("Falha no login:", error.message)
    return { success: false, error: "invalidCredentials", email }
  }

  const rawLocale = formData.get("locale")
  const locale = hasLocale(routing.locales, rawLocale)
    ? rawLocale
    : routing.defaultLocale

  redirect({ href: next, locale })
}
