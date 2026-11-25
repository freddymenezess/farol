import type { ActionResult } from "./action-result-type"

export type LoginState = ActionResult<
  never,
  "INVALID_CREDENTIALS" | undefined,
  { email: string }
>

export type RegisterState = ActionResult<
  never,
  Record<string, string[]>,
  { email: string }
>

export type RequestPasswordRecoveryState = ActionResult<null>
export type ResetPasswordState = ActionResult<null, string, null>
