"use server"

import { redirect } from "@/i18n/navigation"
import { clearPendingVerification } from "@/lib/cookies/pending-verification"
import type { Locale } from "@/types/next-intl-type"

import type {} from "@/types/auth-type"

export async function changeEmailAction(locale: Locale) {
  await clearPendingVerification()
  redirect({ href: "/sign/up", locale })
}
