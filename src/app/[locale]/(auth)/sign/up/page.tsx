import { redirectIfAuthenticated } from "@/helpers/auth-helper"
import { ResetForm } from "@/components/auth/register-form"

import type { Locale } from "@/types/next-intl-type"

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params

  await redirectIfAuthenticated(locale)

  return <ResetForm locale={locale} />
}
