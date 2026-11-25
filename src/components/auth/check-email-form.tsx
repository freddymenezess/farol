"use client"

import { useEffect, useState, useTransition } from "react"
import { useTranslations,  } from "next-intl"
import { REGEXP_ONLY_DIGITS } from "input-otp"

import { HugeiconsIcon } from "@hugeicons/react"
import { Refresh04Icon } from "@hugeicons/core-free-icons"

import { useCountdown } from "@/hooks/use-countdown"
import { resendCodeAction } from "@/actions/auth/resend-code-action"
import { verifyCodeAction } from "@/actions/auth/verify-code-action"
import { changeEmailAction } from "@/actions/auth/change-email-action"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

type CheckEmailFormProps = {
  email: string
  initialSecondsLeft: number
  locale: string
}

const slotClassName =
  "*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl"

export function CheckEmailForm({
  email,
  initialSecondsLeft,
  locale,
}: CheckEmailFormProps) {
  const t = useTranslations("CheckEmail")

  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isVerifying, startVerify] = useTransition()
  const [isResending, startResend] = useTransition()
  const [isLeaving, startLeave] = useTransition()
  const { secondsLeft, restart } = useCountdown(initialSecondsLeft)

  useEffect(() => {
    if (error) toast.error(t(`messages.${error}`))
  }, [t, error])

  function handleVerify(value: string) {
    if (value.length < 6) return

    setError(null)
    startVerify(async () => {
      const result = await verifyCodeAction(locale, value)
      if (result && !result.success) {
        setError(result.error)
        setCode("")
      }
    })
  }

  function handleResend() {
    setError(null)
    startResend(async () => {
      const result = await resendCodeAction()
      if (result.success) {
        restart(result.data.retryAfter)
        return
      }
      setError(result.error)
      if (result.retryAfter) restart(result.retryAfter)
    })
  }

  return (
    <Card className="w-full max-w-md gap-8 shadow-none ring-0">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{t("title")}</CardTitle>
        <CardDescription>
          {t("description.first")}
          <span className="font-semibold">{email}</span>
          {t("description.second")}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="otp-verification">{t("codeLabel")}</FieldLabel>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={handleResend}
              disabled={secondsLeft > 0 || isResending || isVerifying}
            >
              <HugeiconsIcon icon={Refresh04Icon} />
              {secondsLeft > 0
                ? t("resendIn", { seconds: secondsLeft })
                : t("resendCode")}
            </Button>
          </div>

          <InputOTP
            maxLength={6}
            id="otp-verification"
            value={code}
            onChange={setCode}
            onComplete={handleVerify}
            disabled={isVerifying}
            containerClassName="justify-between"
            pattern={REGEXP_ONLY_DIGITS}
            required
          >
            <InputOTPGroup className={slotClassName}>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator className="mx-2" />
            <InputOTPGroup className={slotClassName}>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </Field>
      </CardContent>

      <CardFooter>
        <Field>
          <Button
            type="button"
            className="w-full"
            onClick={() => handleVerify(code)}
            disabled={code.length < 6 || isVerifying}
          >
            {t("submit")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() => startLeave(() => changeEmailAction(locale))}
            disabled={isVerifying || isLeaving}
          >
            {t("backToLogin")}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
