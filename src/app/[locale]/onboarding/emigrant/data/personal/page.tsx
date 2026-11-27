import { requireOnboardingStep } from "@/helpers/onboarding-helper"
import { ROUTES } from "@/lib/onboarding-steps"

export default async function Page() {
  await requireOnboardingStep(ROUTES.emigrantPersonal)

  return <h1>Personal</h1>
}
