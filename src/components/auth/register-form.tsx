"use client"

import { useActionState } from "react"
import { useState, useEffect } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { EyeIcon, EyeOffIcon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { GoogleButton } from "@/components/auth/google-button"
import { cn } from "@/lib/utils"
import { signUpAction } from "@/actions/auth/register-action"

import type { Locale } from "@/types/next-intl-type"
import type { RegisterState } from "@/types/auth-type"

export function ResetForm({
  className,
  locale,
}: {
  className?: string
  locale: Locale
}) {
  const initialState: RegisterState = {
    values: undefined,
    error: {},
    success: false,
  }
  const [state, formAction, isPending] = useActionState<
    RegisterState,
    FormData
  >(signUpAction.bind(null, locale), initialState)
  const [showPassword, setShowPassword] = useState(false)
  const t = useTranslations("Register")

  useEffect(() => {
    if (!state.success && state.error?.signup) {
      toast.error(t(`messages.${state.error.signup[0]}`))
    }
  }, [state, t])

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
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">{t("emailLabel")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder={t("emailPlaceholder")}
                defaultValue={!state.success ? (state.values?.email ?? "") : ""}
              />
              <div>
                {!state.success &&
                  state.values?.email &&
                  state.error.email.map((error, index) => (
                    <p key={index} className="text-sm text-destructive">
                      {t(`messages.${error}`)}
                    </p>
                  ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">{t("passwordLabel")}</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder={t("passwordPlaceholder")}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? t("hidePassword") : t("showPassword")
                  }
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <HugeiconsIcon
                    icon={showPassword ? EyeOffIcon : EyeIcon}
                    size={20}
                    color="currentColor"
                  />
                </button>
              </div>
              <div>
                {!state.success &&
                  state.error?.password &&
                  state.error.password.map((error, index) => (
                    <p key={index} className="text-sm text-destructive">
                      {t(`messages.${error}`)}
                    </p>
                  ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">
                {t("confirmPasswordLabel")}
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder={t("confirmPasswordPlaceholder")}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? t("hidePassword") : t("showPassword")
                  }
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <HugeiconsIcon
                    icon={showPassword ? EyeOffIcon : EyeIcon}
                    size={20}
                    color="currentColor"
                  />
                </button>
              </div>
              <div>
                {!state.success &&
                  state.error?.confirmPassword &&
                  state.error.confirmPassword.map((error, index) => (
                    <p key={index} className="text-sm text-destructive">
                      {t(`messages.${error}`)}
                    </p>
                  ))}
              </div>
              <div></div>
            </div>
          </div>
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
          <p className="self-center text-sm text-muted-foreground">
            {t("hasAccount")}{" "}
            <Link
              href="/sign/in"
              className="font-medium text-primary hover:underline"
            >
              {t("signIn")}
            </Link>
          </p>
          <div className="flex flex-nowrap items-center gap-3">
            <Separator className="flex-1" />
            <p className="text-center text-sm text-muted-foreground">
              {t("or")}
            </p>
            <Separator className="flex-1" />
          </div>
          <GoogleButton />
        </CardFooter>
      </form>
    </Card>
  )
}
