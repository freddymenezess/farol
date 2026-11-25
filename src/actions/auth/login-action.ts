"use server"

import { createClient } from "@/lib/supabase/server"
import { loginSchema } from "@/lib/schemas/auth-schema"
import { resolveDestination } from "@/services/auth-service"
import { redirect } from "@/i18n/navigation"

import type { LoginState } from "@/types/auth-type"
import type { Locale } from "@/types/next-intl-type"

export async function signInAction(
  locale: Locale,
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const next = String(formData.get("next"))
  const email = String(formData.get("email") ?? "")

  const parsed = loginSchema.safeParse({
    email,
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return { success: false, error: "INVALID_CREDENTIALS", values: { email } }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    console.error("LOGIN_FAILED:", error.message)
    return { success: false, error: "INVALID_CREDENTIALS", values: { email } }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const pathname = await resolveDestination(user.id, next)

    redirect({ href: pathname, locale })
  }
}
