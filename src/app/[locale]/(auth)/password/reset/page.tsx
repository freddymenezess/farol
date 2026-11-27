import { hasPasswordRecovery } from "@/lib/cookies/password-recovery"
import { requireUser } from "@/lib/supabase/user"
import { redirect } from "@/i18n/navigation"
import { resolveDestination } from "@/services/auth/resolve-destination-service"
import { ResetForm } from "@/components/auth/reset-form"

import type { Locale } from "@/types/next-intl-type"

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const has = await hasPasswordRecovery()

  if (!has) {
    const user = await requireUser(locale)
    const href = await resolveDestination(user.id)

    redirect({ href, locale })
  }

  return <ResetForm locale={locale} />
}
