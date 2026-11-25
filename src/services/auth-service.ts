import { getOnboardingState, saveNextInDraft } from "./onboarding-draft-service"
import { safeNext } from "@/lib/utils"
import { stepToPath } from "@/lib/onboarding-draft-steps"

export async function resolveDestination(
  userId: string,
  next: string | null = null
) {
  const state = await getOnboardingState(userId)
  const safe = safeNext(next)

  if (state.kind === "ready") {
    const isAdmin = state.path.startsWith("/admin")
    return !isAdmin && safe ? safe : state.path
  }

  if (safe) await saveNextInDraft({ userId, draft: state.draft, next: safe })

  return state.draft
    ? stepToPath(state.draft.role, state.draft.step)
    : stepToPath(null, 1)
}
