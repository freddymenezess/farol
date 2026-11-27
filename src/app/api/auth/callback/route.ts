import { NextResponse } from "next/server"

import { getPathname } from "@/i18n/navigation"
import { createClient } from "@/lib/supabase/server"
import { resolveLocale } from "@/lib/resolve-locale"
import { safeNext } from "@/lib/utils"
import { resolveDestination } from "@/services/auth/resolve-destination-service"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)

  const code = searchParams.get("code")
  const next = safeNext(searchParams.get("next"))
  const locale = await resolveLocale(searchParams)

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const userId = user.id
        const destination = await resolveDestination(userId, next)
        const path = getPathname({ href: destination, locale })
        return NextResponse.redirect(new URL(path, origin))
      }
    } else {
      console.error("OAuth callback error:", error.message)
    }
  }

  const path = getPathname({
    href: {
      pathname: "/sign/in",
      query: { error: "auth-failed", ...(next && { next }) },
    },
    locale,
  })
  return NextResponse.redirect(new URL(path, origin))
}
