"use server"

import { z } from "zod"

import { createClient } from "@/lib/supabase/server"

import type { RequestPasswordRecoveryState } from "@/types/auth-type"
import type { ActionResult } from "@/types/action-result-type"

const schema = z.email()

export async function requestPasswordRecoveryAction(
  _prevState: RequestPasswordRecoveryState,
  formData: FormData
): Promise<ActionResult<null>> {
  const parsed = schema.safeParse(formData.get("email"))
  if (!parsed.success) return { success: false, error: "INVALID_EMAIL_ADDRESS" }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data)

  if (error) {
    console.error("Password recovery error:", error.message)
    if (error.code === "over_email_send_rate_limit") {
      return { success: false, error: "OVER_EMAIL_SEND_RATE_LIMIT" }
    }
    return { success: false, error: "SEND_FAILED" }
  }

  return { success: true, data: null }
}
