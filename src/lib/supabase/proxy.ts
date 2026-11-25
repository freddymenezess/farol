import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { routing } from "@/i18n/routing"
import { PASSWORD_RECOVERY_COOKIE } from "@/lib/cookies/names"

const publicPaths = ["/", "/sign", "/password/recover"]

function removeLocale(pathname: string) {
  const locale = routing.locales.find(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  )
  if (!locale) return pathname
  return pathname.slice(locale.length + 1) || "/"
}

function isPublic(pathname: string) {
  return publicPaths.some((p) =>
    p === "/"
      ? pathname === "/"
      : pathname === p || pathname.startsWith(`${p}/`)
  )
}

export async function updateSession(
  request: NextRequest,
  createResponse: () => NextResponse
) {
  let response = createResponse()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = createResponse()
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data } = await supabase.auth.getClaims()
  const user = data?.claims
  const path = removeLocale(request.nextUrl.pathname)
  const next = path + request.nextUrl.search

  if (
    user &&
    request.cookies.has(PASSWORD_RECOVERY_COOKIE) &&
    path !== "/password/reset"
  ) {
    const url = request.nextUrl.clone()
    url.pathname = "/password/reset"
    url.search = `?next=${encodeURIComponent(next)}`

    const redirect = NextResponse.redirect(url)
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie))
    return redirect
  }

  if (!user && request.cookies.has(PASSWORD_RECOVERY_COOKIE)) {
    response.cookies.delete(PASSWORD_RECOVERY_COOKIE)
  }

  if (!user && !isPublic(removeLocale(request.nextUrl.pathname))) {
    const url = request.nextUrl.clone()
    url.pathname = "/sign/in"
    url.search = `?next=${encodeURIComponent(next)}`
    return NextResponse.redirect(url)
  }

  return response
}
