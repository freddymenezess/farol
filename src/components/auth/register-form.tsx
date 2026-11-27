"use client"

import { useActionState, useEffect, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { EyeIcon, EyeOffIcon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import { GoogleButton } from "@/components/auth/google-button"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import { signUpAction } from "@/actions/auth/register-action"

import type { Locale } from "@/types/next-intl-type"
import type { RegisterState } from "@/types/auth-type"

const initialState: RegisterState = {
  values: undefined,
  error: {},
  success: false,
}

export function RegisterForm({
  className,
  locale,
}: {
  className?: string
  locale: Locale
}) {
  const t = useTranslations("Register")
  const [showPassword, setShowPassword] = useState(false)
  const [state, formAction, isPending] = useActionState<RegisterState, FormData>(
    signUpAction.bind(null, locale),
    initialState
  )

  const errors = state.success ? {} : state.error

  useEffect(() => {
    if (errors.signup?.[0]) {
      toast.error(t(`messages.${errors.signup[0]}`))
    }
  }, [errors.signup, t])

  const messages = (codes?: string[]) =>
    codes?.map((code) => ({ message: t(`messages.${code}`) }))

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
          <CardTitle className="text-xl font-semibold">{t("title")}</CardTitle>
          <CardDescription className="col-span-2">
            {t("description")}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <FieldGroup>
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">{t("emailLabel")}</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                required
                aria-invalid={!!errors.email}
                placeholder={t("emailPlaceholder")}
                defaultValue={!state.success ? (state.values?.email ?? "") : ""}
              />
              <FieldError errors={messages(errors.email)} />
            </Field>

            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="password">{t("passwordLabel")}</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  aria-invalid={!!errors.password}
                  placeholder={t("passwordPlaceholder")}
                />
                {passwordToggle}
              </InputGroup>
              <FieldError errors={messages(errors.password)} />
            </Field>

            <Field data-invalid={!!errors.confirmPassword}>
              <FieldLabel htmlFor="confirmPassword">
                {t("confirmPasswordLabel")}
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  aria-invalid={!!errors.confirmPassword}
                  placeholder={t("confirmPasswordPlaceholder")}
                />
                {passwordToggle}
              </InputGroup>
              <FieldError errors={messages(errors.confirmPassword)} />
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
          <div className="flex flex-nowrap items-center gap-3">
            <Separator className="flex-1" />
            <p className="text-center text-sm text-muted-foreground">
              {t("or")}
            </p>
            <Separator className="flex-1" />
          </div>
          <GoogleButton />
          <p className="self-center text-sm text-muted-foreground">
            {t("hasAccount")}{" "}
            <Link
              href="/sign/in"
              className="font-medium text-primary hover:underline"
            >
              {t("signIn")}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}