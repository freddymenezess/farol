import { Logo } from "@/components/ui/logo"
import { ChoosePaperForm } from "@/components/onboarding/choose-role-form"
import { OnboardingCarousel } from "@/components/onboarding/carousel"
import { requireOnboardingStep } from "@/helpers/onboarding-helper"
import { ROUTES } from "@/lib/onboarding-steps"


import type { Locale } from "@/types/next-intl-type"

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  await requireOnboardingStep(ROUTES.role)

  const { locale } = await params

  return (
    <main className="grid lg:grid-cols-2 min-h-svh">
      <div className="flex flex-col items-center min-h-svh">
        <Logo />
        <ChoosePaperForm className="flex-1" locale={locale} />
      </div>

      <div className="hidden lg:block">
        <OnboardingCarousel />
      </div>
    </main>
  )
}
