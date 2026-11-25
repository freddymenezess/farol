import { redirect } from "@/i18n/navigation"

import { prisma } from "@/lib/prisma"
import { ROUTES, pathToStep, stepToPath } from "@/lib/onboarding-draft-steps"

import { Role } from "@/generated/prisma/enums"
import type { OnboardingDraftModel } from "@/generated/prisma/models"
import type { OnboardingPath } from "@/lib/onboarding-draft-steps"

const DRAFT_TTL_DAYS = 7 // TODO: alinhar com o prazo de limpeza do trigger

export function newDraftExpiry() {
  return new Date(Date.now() + DRAFT_TTL_DAYS * 24 * 60 * 60 * 1000)
}

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

export async function saveNextInDraft({
  userId,
  draft,
  next,
}: {
  userId: string
  draft: OnboardingDraftModel | null
  next: string
}) {
  const fresh = {
    role: null,
    step: 1,
    data: { next },
    expiresAt: newDraftExpiry(),
  }

  await prisma.onboardingDraft.upsert({
    where: { userId },
    update: draft ? { data: { ...asObject(draft.data), next } } : fresh,
    create: { userId, ...fresh },
  })
}

export async function getOnboardingState(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { emigrantProfile: true, hostProfile: true, draft: true },
  })
  if (!user) throw new Error(`Linha em users em falta para ${userId}`)

  if (user.role === Role.ADMIN)
    return { kind: "ready" as const, path: "/admin" }
  if (user.role === Role.SUPER_ADMIN)
    return { kind: "ready" as const, path: "/admin/super" }
  if (user.emigrantProfile) return { kind: "ready" as const, path: "/emigrant" }
  if (user.hostProfile) return { kind: "ready" as const, path: "/host" }

  const draft =
    user.draft && user.draft.expiresAt > new Date() ? user.draft : null
  return { kind: "onboarding" as const, draft }
}

export async function guardOnboardingDraft({
  userId,
  locale = "pt",
  pathname,
}: {
  userId: string
  locale?: string
  pathname: OnboardingPath
}) {
  const state = await getOnboardingState(userId)
  if (state.kind === "ready") redirect({ href: state.path, locale })

  const draft = state.draft
  if (!draft) {
    if (pathname === ROUTES.paper) return null
    redirect({ href: ROUTES.paper, locale })
  }

  const requested = pathToStep(draft.role, pathname)
  if (requested === null || requested > draft.step) {
    redirect({ href: stepToPath(draft.role, draft.step), locale })
  }
  return draft
}
