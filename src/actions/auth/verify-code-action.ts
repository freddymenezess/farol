"use server"

import { redirect } from "@/i18n/navigation"
import { z } from "zod"
import {
  clearPendingVerification,
  getPendingVerification,
} from "@/lib/cookies/pending-verification"
import { createClient } from "@/lib/supabase/server"
import { ROUTES } from "@/lib/onboarding-draft-steps"

import type { ActionResult } from "@/types/action-result-type"
import type { Locale } from "@/types/next-intl-type"

const schema = z.string().regex(/^\d{6}$/)

export async function verifyCodeAction(
  locale: Locale,
  code: string
): Promise<ActionResult> {
  const parsed = schema.safeParse(code)
  if (!parsed.success) return { success: false, error: "INVALID_CODE" }

  const pending = await getPendingVerification()
  if (!pending) {
    return { success: false, error: "SESSION_EXPIRED" }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.verifyOtp({
    email: pending.email,
    token: parsed.data,
    type: "email",
  })

  if (error) return { success: false, error: "INVALID_CODE" }

  await clearPendingVerification()
  redirect({ href: ROUTES.paper, locale })
}
