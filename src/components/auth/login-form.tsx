"use client"

import { useActionState } from "react"
import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  AlertCircleIcon,
  EyeIcon,
  EyeOffIcon,
} from "@hugeicons/core-free-icons"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Link } from "@/i18n/navigation"
import { useTranslations, useLocale } from "next-intl"
import { GoogleLogo } from "@/components/ui/google-logo"
import { cn } from "@/lib/utils"
import { signinAction } from "@/actions/auth/login"
import type { LoginState } from "@/types/auth"

export function LoginForm({ className }: { className?: string }) {
  const initialState: LoginState = {
    email: "",
    error: undefined,
    success: false,
  }
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    signinAction,
    initialState
  )
  const [showPassword, setShowPassword] = useState(false)
  const next = new URLSearchParams(location.search).get("next") || "/dashboard"
  const locale = useLocale()
  const t = useTranslations("Login")

  return (
    <Card className={cn("w-full max-w-sm shadow-none ring-0", className)}>
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
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">{t("emailLabel")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t("emailPlaceholder")}
                defaultValue={state.email}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">{t("passwordLabel")}</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm text-muted-foreground underline-offset-4 hover:underline"
                >
                  {t("forgotPassword")}
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("passwordPlaceholder")}
                  className="pr-10"
                  required
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
            </div>
            {state.error && (
              <p className="flex items-start gap-1 text-sm text-destructive">
                <HugeiconsIcon
                  icon={AlertCircleIcon}
                  size={14}
                  color="currentColor"
                  strokeWidth={2}
                  className="mt-0.5 shrink-0"
                />
                <span>{t(`error.${state.error}`)}</span>
              </p>
            )}
          </div>
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="next" value={next} />
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-4">
          <Button
            type="submit"
            className="w-full group-invalid:pointer-events-none group-invalid:opacity-50"
            disabled={isPending}
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
          <Button variant="outline" className="w-full" disabled={isPending}>
            <GoogleLogo />
            {t("google")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
