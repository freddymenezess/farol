import { redirectIfAuthenticated } from "@/helpers/auth-helper"
import { redirect } from "@/i18n/navigation"
import {
  getPendingVerification,
  secondsUntil,
} from "@/lib/cookies/pending-verification"
import { CheckEmailForm } from "@/components/auth/check-email-form"
import type { Locale } from "@/types/next-intl-type"

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params

  const pending = await getPendingVerification()

  if (!pending) {
    await redirectIfAuthenticated(locale)
    redirect({ href: "sign/in", locale })
  }

  return (
    <CheckEmailForm
      locale={locale}
      email={pending.email}
      initialSecondsLeft={secondsUntil(pending.resendAvailableAt)}
    />
  )
}
