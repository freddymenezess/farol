import "server-only"

import { clearCookie, getSignedCookie, setSignedCookie } from "./signed-cookie"

const COOKIE_NAME = "farol_pending_verification"
export const RESEND_COOLDOWN_SECONDS = 60

type Pending = { email: string; resendAvailableAt: number }

export function setPendingVerification(
  email: string,
  cooldownSeconds = RESEND_COOLDOWN_SECONDS
) {
  return setSignedCookie<Pending>(
    COOKIE_NAME,
    { email, resendAvailableAt: Date.now() + cooldownSeconds * 1000 },
    60 * 60
  )
}

export const getPendingVerification = () =>
  getSignedCookie<Pending>(COOKIE_NAME)
export const clearPendingVerification = () => clearCookie(COOKIE_NAME)

export function secondsUntil(timestamp: number) {
  return Math.max(0, Math.ceil((timestamp - Date.now()) / 1000))
}
