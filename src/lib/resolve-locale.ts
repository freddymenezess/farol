import "server-only"

import { cookies } from "next/headers"
import { hasLocale } from "next-intl"

import { routing } from "@/i18n/routing"

export async function resolveLocale(searchParams: URLSearchParams) {
  const fromQuery = searchParams.get("locale")
  if (hasLocale(routing.locales, fromQuery)) return fromQuery

  const fromCookie = (await cookies()).get("NEXT_LOCALE")?.value
  if (hasLocale(routing.locales, fromCookie)) return fromCookie

  return routing.defaultLocale
}
