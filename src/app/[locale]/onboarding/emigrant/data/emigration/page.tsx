import { requireOnboardingStep } from "@/helpers/onboarding-helper"
import { ROUTES } from "@/lib/onboarding-steps"

export default async function Page() {
  await requireOnboardingStep(ROUTES.emigrantEmigration)

  return <h1>Emigration</h1>
}
