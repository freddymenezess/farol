import { cache } from "react"
import { redirect } from "@/i18n/navigation"
import type { Locale } from "@/types/next-intl-type"

import { createClient } from "@/lib/supabase/server"

export const getCurrentUser = cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
})

export async function requireUser(locale: Locale) {
  const user = await getCurrentUser()
  if (!user) redirect({ href: "/sign/in", locale })
  return user
}
