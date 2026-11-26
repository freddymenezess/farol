"use client"

import { useActionState, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { EyeIcon, EyeOffIcon } from "@hugeicons/core-free-icons"
import { useTranslations } from "next-intl"
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { resetPasswordAction } from "@/actions/auth/reset-action"
import { cn } from "@/lib/utils"

import type { Locale } from "@/types/next-intl-type"
import type { ResetPasswordState } from "@/types/auth-type"

const initialState: ResetPasswordState = {
  error: "",
  success: false,
}

export function ResetForm({
  className,
  locale,
}: {
  className?: string
  locale: Locale
}) {
  const t = useTranslations("Reset")
  const [showPassword, setShowPassword] = useState(false)
  const [state, formAction, isPending] = useActionState<
    ResetPasswordState,
    FormData
  >(resetPasswordAction.bind(null, locale), initialState)

  const searchParams = useSearchParams()
  const urlError = searchParams.get("error") || undefined

  useEffect(() => {
    if (urlError) {
      toast.error(t("messages.ERROR"))
    } else if (!state.success && state.error) {
      toast.error(t(`messages.${state.error}`))
    }
  }, [state, t, urlError])

  const passwordToggle = (
    <InputGroupAddon align="inline-end">
      <InputGroupButton
        type="button"
        size="icon-xs"
        onClick={() => setShowPassword((prev) => !prev)}
        aria-label={showPassword ? t("hidePassword") : t("showPassword")}
      >
        <HugeiconsIcon
          icon={showPassword ? EyeOffIcon : EyeIcon}
          size={20}
          color="currentColor"
        />
      </InputGroupButton>
    </InputGroupAddon>
  )

  return (
    <Card className={cn("w-full max-w-md shadow-none ring-0", className)}>
      <form
        className="group flex flex-col gap-(--card-spacing)"
        action={formAction}
      >
        <CardHeader>
          <CardTitle className="text-xl font-semibold col-span-2">{t("title")}</CardTitle>
          <CardDescription className="col-span-2">
            {t("description")}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="password">
                {t("newPasswordLabel")}
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder={t("newPasswordPlaceholder")}
                />
                {passwordToggle}
              </InputGroup>
            </Field>

            <Field>
              <FieldLabel htmlFor="confirmPassword">
                {t("confirmPasswordLabel")}
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder={t("confirmPasswordPlaceholder")}
                />
                {passwordToggle}
              </InputGroup>
            </Field>
          </FieldGroup>
        </CardContent>

        <CardFooter className="flex-col items-stretch gap-4">
          <Button
            type="submit"
            className="w-full group-invalid:pointer-events-none group-invalid:opacity-50"
            isPending={isPending}
            disabled={isPending}
            spinner
          >
            {t("submit")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
