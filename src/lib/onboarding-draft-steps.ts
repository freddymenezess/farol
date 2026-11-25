import type { OnboardingRole } from "@/generated/prisma/enums"

export const ROUTES = {
  paper: "/onboarding/paper",
  emigrantPersonal: "/onboarding/emigrant/data/personal",
  emigrantEmigration: "/onboarding/emigrant/data/emigration",
  hostPersonal: "/onboarding/host/data/personal",
  hostAccommodate: "/onboarding/host/data/accommodate",
  hostIdentity: "/onboarding/host/docs/identity",
  hostResidence: "/onboarding/host/docs/residence",
} as const

export type OnboardingPath = (typeof ROUTES)[keyof typeof ROUTES]

const COMMON_STEPS = [ROUTES.paper] as const

const STEPS_BY_ROLE = {
  EMIGRANT: [
    ...COMMON_STEPS,
    ROUTES.emigrantPersonal,
    ROUTES.emigrantEmigration,
  ],
  HOST: [
    ...COMMON_STEPS,
    ROUTES.hostPersonal,
    ROUTES.hostAccommodate,
    ROUTES.hostIdentity,
    ROUTES.hostResidence,
  ],
} as const satisfies Record<OnboardingRole, readonly OnboardingPath[]>

function getStepList(role: OnboardingRole | null): readonly OnboardingPath[] {
  return role ? STEPS_BY_ROLE[role] : COMMON_STEPS
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function stepToPath(role: OnboardingRole | null, step: number) {
  const steps = getStepList(role)
  return steps[clamp(step, 1, steps.length) - 1]
}

export function pathToStep(
  role: OnboardingRole | null,
  pathname: OnboardingPath
) {
  const index = getStepList(role).indexOf(pathname)
  return index === -1 ? null : index + 1
}
