import { requireOnboardingStep } from "@/helpers/onboarding-draft-helper"
import { ROUTES } from "@/lib/onboarding-draft-steps"

export default async function Page() {
  await requireOnboardingStep(ROUTES.emigrantPersonal)

  return <h1>Personal</h1>
}
