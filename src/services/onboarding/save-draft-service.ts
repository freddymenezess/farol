import { prisma } from "@/lib/prisma"

import type { OnboardingDraftModel } from "@/generated/prisma/models"

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
    answers: { next },
    expiresAt: newDraftExpiry(),
  }

  await prisma.onboardingDraft.upsert({
    where: { userId },
    update: draft ? { answers: { ...asObject(draft.answers), next } } : fresh,
    create: { userId, ...fresh },
  })
}
