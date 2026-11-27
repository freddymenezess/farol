import { prisma } from "@/lib/prisma"
import { ROUTES, nextStep } from "@/lib/onboarding-steps"
import { newDraftExpiry } from "@/services/onboarding/save-draft-service"

import type { OnboardingRole } from "@/generated/prisma/enums"

export async function chooseRoleService(userId: string, role: OnboardingRole) {
  await prisma.onboardingDraft.update({
    where: { userId },
    data: {
      role,
      step: nextStep(role, ROUTES.role),
      expiresAt: newDraftExpiry(),
    },
  })
}

