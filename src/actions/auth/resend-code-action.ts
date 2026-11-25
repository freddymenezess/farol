"use server"

import {
  RESEND_COOLDOWN_SECONDS,
  getPendingVerification,
  setPendingVerification,
} from "@/lib/cookies/pending-verification"
import { createClient } from "@/lib/supabase/server"

import type { ActionResult } from "@/types/action-result-type"

export async function resendCodeAction(): Promise<
  ActionResult<{ retryAfter: number }>
> {
  const pending = await getPendingVerification()
  if (!pending) {
    return { success: false, error: "SESSION_EXPIRED" }
  }

  const wait = Math.ceil((pending.resendAvailableAt - Date.now()) / 1000)
  if (wait > 0) {
    return {
      success: false,
      error: "WAIT_ASK_EMAIL",
      retryAfter: wait,
    }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: pending.email,
  })

  if (error) {
    if (error.code === "OVER_EMAIL_SEND_RATE_LIMIT") {
      const seconds = Number(error.message.match(/(\d+) seconds/)?.[1] ?? 60)
      await setPendingVerification(pending.email, seconds)
      return { success: false, error: "Aguarda um pouco.", retryAfter: seconds }
    }
    console.error("resend error:", error)
    return { success: false, error: "ERROR_SENDIND_CODE" }
  }

  await setPendingVerification(pending.email)
  return { success: true, data: { retryAfter: RESEND_COOLDOWN_SECONDS } }
}
