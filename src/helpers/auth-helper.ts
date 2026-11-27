import { resolveDestination } from "@/services/auth/resolve-destination-service"
import { getCurrentUser } from "@/lib/supabase/user"
import { redirect } from "@/i18n/navigation"

import type { Locale } from "@/types/next-intl-type"

export async function redirectIfAuthenticated(locale: Locale, next?: string) {
  const user = await getCurrentUser()

  if (user) {
    const href = await resolveDestination(user.id, next)
    redirect({ href, locale })
  }
}
