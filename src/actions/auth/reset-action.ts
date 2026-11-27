"use server"

import { z } from "zod"
import { redirect } from "@/i18n/navigation"
import { createClient } from "@/lib/supabase/server"
import { resetSchema } from "@/lib/schemas/auth-schema"
import { requireUser } from "@/lib/supabase/user"
import { resolveDestination } from "@/services/auth/resolve-destination-service"
import { clearPasswordRecovery } from "@/lib/cookies/password-recovery"

import type { ResetPasswordState } from "@/types/auth-type"
import type { Locale } from "@/types/next-intl-type"

export async function resetPasswordAction(
  locale: Locale,
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const { id: userId } = await requireUser(locale)

  const parsed = resetSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  })

  if (!parsed.success) {
    const errors = z.flattenError(parsed.error).fieldErrors

    return {
      success: false as const,
      error: errors.password ? errors.password[0] : "",
    }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  })

  if (error) {
    if (error.code === "same_password")
      return { success: false as const, error: "SAME_PASSWORD" }

    console.error("Falha ao definir nova palavra-passe:", error.message)
    return { success: false as const, error: "ERROR" }
  }

  await clearPasswordRecovery()

  const href = await resolveDestination(userId)

  redirect({ href, locale })
}
