import "server-only"

import { cookies } from "next/headers"

import { PASSWORD_RECOVERY_COOKIE } from "./names"

const MAX_AGE_SECONDS = 60 * 15

export async function setPasswordRecovery() {
  const store = await cookies()
  
  store.set(PASSWORD_RECOVERY_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  })
}

export async function hasPasswordRecovery() {
  const store = await cookies()
  return store.has(PASSWORD_RECOVERY_COOKIE)
}

export async function clearPasswordRecovery() {
  const store = await cookies()
  store.delete(PASSWORD_RECOVERY_COOKIE)
}
