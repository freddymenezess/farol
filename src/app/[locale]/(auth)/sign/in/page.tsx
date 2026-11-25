import { redirectIfAuthenticated } from "@/helpers/auth-helper"
import { LoginForm } from "@/components/auth/login-form"

import type { Locale } from "@/types/next-intl-type"

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params

  await redirectIfAuthenticated(locale)

  return <LoginForm locale={locale} />
}
