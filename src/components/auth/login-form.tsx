"use client"

import { useActionState } from "react"
import { useState, useEffect } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { useSearchParams } from "next/navigation"
import { EyeIcon, EyeOffIcon } from "@hugeicons/core-free-icons"
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
import { toast } from "sonner"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { GoogleButton } from "@/components/auth/google-button"
import { cn, safeNext } from "@/lib/utils"
import { signInAction } from "@/actions/auth/login-action"

import type { Locale } from "@/types/next-intl-type"
import type { LoginState } from "@/types/auth-type"

export function LoginForm({
  className,
  locale,
}: {
  className?: string
  locale: Locale
}) {
  const initialState: LoginState = {
    success: false,
    error: undefined,
    values: {
      email: "",
    },
  }
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    signInAction.bind(null, locale),
    initialState
  )
  const [showPassword, setShowPassword] = useState(false)
  const searchParams = useSearchParams()
  const next = safeNext(searchParams.get("next")) || "/emigrant"
  const error = searchParams.get("error") || undefined
  const t = useTranslations("Login")

  useEffect(() => {
    if (error) {
      toast.error(t("messages.ERROR"))
    } else if (!state.success && state.error) {
      toast.error(t(`messages.${state.error}`))
    }
  }, [state, t, error])

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
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">{t("emailLabel")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t("emailPlaceholder")}
                defaultValue={!state.success ? (state.values?.email ?? "") : ""}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">{t("passwordLabel")}</Label>
                <Link
                  href="/password/recover"
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
          </div>
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
