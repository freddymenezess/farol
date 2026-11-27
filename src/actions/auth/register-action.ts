"use server"

import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import { setPendingVerification } from "@/lib/cookies/pending-verification"
import { registerSchema } from "@/lib/schemas/auth-schema"
import { redirect } from "@/i18n/navigation"
import { resolveDestination } from "@/services/auth/resolve-destination-service"

import type { RegisterState } from "@/types/auth-type"
import type { Locale } from "@/types/next-intl-type"

export async function signUpAction(
  locale: Locale,
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  })

  if (!parsed.success) {
    return {
      success: false as const,
      error: z.flattenError(parsed.error).fieldErrors,
      values: {
        email: String(formData.get("email") ?? ""),
      },
    }
  }

  const { email, password } = parsed.data

  const supabase = await createClient()
  const {
    error,
    data: { user },
  } = await supabase.auth.signUp({
    email: email,
    password: password,
  })

  await setPendingVerification(email)

  if (error || !user) {
    console.error("Falha ao se cadastrar:", error?.message)

    return {
      success: false as const,
      error: { signup: ["REGISTRATION_FAILED"] },
      values: { email },
    }
  }

  const href = await resolveDestination(user.id)

  redirect({ href, locale })
}
