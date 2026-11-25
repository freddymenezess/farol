import "server-only"

import { createHmac, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"

function sign(payload: string) {
  return createHmac("sha256", process.env.COOKIE_SECRET!)
    .update(payload)
    .digest("base64url")
}

export async function setSignedCookie<T>(
  name: string,
  data: T,
  maxAgeSeconds: number
) {
  const payload = Buffer.from(JSON.stringify(data)).toString("base64url")
  const store = await cookies()
  store.set(name, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
  })
}

export async function getSignedCookie<T>(name: string): Promise<T | null> {
  const store = await cookies()
  const raw = store.get(name)?.value
  if (!raw) return null

  const [payload, signature] = raw.split(".")
  if (!payload || !signature) return null

  const expected = Buffer.from(sign(payload))
  const received = Buffer.from(signature)
  if (expected.length !== received.length) return null
  if (!timingSafeEqual(expected, received)) return null

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString()) as T
  } catch {
    return null
  }
}

export async function clearCookie(name: string) {
  const store = await cookies()
  store.delete(name)
}
