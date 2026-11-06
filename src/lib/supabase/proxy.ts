import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { routing } from "@/i18n/routing"

const publicPaths = ["/", "/login", "/cadastro", "/auth"]

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

  if (!user && !isPublic(removeLocale(request.nextUrl.pathname))) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  return response
}
