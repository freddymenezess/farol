import { getLocale } from "next-intl/server"

import { requireUser } from "@/lib/supabase/user"
import { guardOnboardingDraft } from "@/services/onboarding/get-draft-service"

import type { OnboardingPath } from "@/lib/onboarding-steps"
import type { Locale } from "@/types/next-intl-type"

export async function requireOnboardingStep(pathname: OnboardingPath) {
  const locale = (await getLocale()) as Locale
  const user = await requireUser(locale)
  const draft = await guardOnboardingDraft({
    userId: user.id,
    locale,
    pathname,
  })
  return { user, draft }
}
