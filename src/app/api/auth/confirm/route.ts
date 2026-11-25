import { NextResponse } from "next/server"

import { getPathname } from "@/i18n/navigation"
import { createClient } from "@/lib/supabase/server"
import { resolveLocale } from "@/lib/resolve-locale"
import { setPasswordRecovery } from "@/lib/cookies/password-recovery"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)

  const tokenHash = searchParams.get("token_hash")
  const locale = await resolveLocale(searchParams)

  if (tokenHash && searchParams.get("type") === "recovery") {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({
      type: "recovery",
      token_hash: tokenHash,
    })

    if (!error) {
      const path = getPathname({ href: "/password/reset", locale })

      await setPasswordRecovery()
      
      return NextResponse.redirect(new URL(path, origin))
    }
    console.error("Recovery confirm error:", error.message)
  }

  const path = getPathname({
    href: { pathname: "/password/recover", query: { error: "link-invalid" } },
    locale,
  })

  return NextResponse.redirect(new URL(path, origin))
}
