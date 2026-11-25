"use server"

import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { setPendingVerification } from "@/lib/cookies/pending-verification"
import { registerSchema } from "@/lib/schemas/auth-schema"
import { redirect } from "@/i18n/navigation"
import { ROUTES } from "@/lib/onboarding-draft-steps"

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
      success: false,
      error: z.flattenError(parsed.error).fieldErrors,
      values: {
        email: String(formData.get("email") ?? ""),
      },
    }
  }

  const { email, password } = parsed.data

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: email,
    password: password,
  })
  await setPendingVerification(email)

  if (error) {
    console.error("REGISTRATION_FAILED:", error.message)
    return {
      success: false,
      error: { signup: ["REGISTRATION_FAILED"] },
      values: { email },
    }
  }

  redirect({ href: ROUTES.paper, locale })
}
