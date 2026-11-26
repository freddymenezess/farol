"use client"

import { useActionState, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { EyeIcon, EyeOffIcon } from "@hugeicons/core-free-icons"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { GoogleButton } from "@/components/auth/google-button"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import { signInAction } from "@/actions/auth/login-action"
import { Link } from "@/i18n/navigation"
import { cn, safeNext } from "@/lib/utils"

import type { Locale } from "@/types/next-intl-type"
import type { LoginState } from "@/types/auth-type"

const initialState: LoginState = {
  success: false,
  error: undefined,
  values: { email: "" },
}

export function LoginForm({
  className,
  locale,
}: {
  className?: string
  locale: Locale
}) {
  const t = useTranslations("Login")
  const [showPassword, setShowPassword] = useState(false)
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    signInAction.bind(null, locale),
    initialState
  )

  const searchParams = useSearchParams()
  const next = safeNext(searchParams.get("next")) || "/emigrant"
  const urlError = searchParams.get("error") || undefined

  useEffect(() => {
    if (urlError) {
      toast.error(t("messages.ERROR"))
    } else if (!state.success && state.error) {
      toast.error(t(`messages.${state.error}`))
    }
  }, [state, t, urlError])

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
          <CardAction>
            <Link
              href="/sign/up"
              className={buttonVariants({ variant: "link" })}
            >
              {t("signUp")}
            </Link>
          </CardAction>
        </CardHeader>

        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">{t("emailLabel")}</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder={t("emailPlaceholder")}
                defaultValue={!state.success ? (state.values?.email ?? "") : ""}
              />
            </Field>

            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">{t("passwordLabel")}</FieldLabel>
                <Link
                  href="/password/recover"
                  className="ml-auto text-sm text-muted-foreground underline-offset-4 hover:underline"
                >
                  {t("forgotPassword")}
                </Link>
              </div>
              <InputGroup>
                <InputGroupInput
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder={t("passwordPlaceholder")}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    size="icon-xs"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? t("hidePassword") : t("showPassword")
                    }
                  >
                    <HugeiconsIcon
                      icon={showPassword ? EyeOffIcon : EyeIcon}
                      size={20}
                      color="currentColor"
                    />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </FieldGroup>
          <input type="hidden" name="next" value={next} />
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
          <GoogleButton next={next} />
        </CardFooter>
      </form>
    </Card>
  )
}
