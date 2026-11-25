import { redirectIfAuthenticated } from "@/helpers/auth-helper"
import { RecoverForm } from "@/components/auth/recover-form"

import type { Locale } from "@/types/next-intl-type"

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params

  await redirectIfAuthenticated(locale)

  return <RecoverForm />
}
