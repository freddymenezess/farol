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
import { useTranslations, useLocale } from "next-intl"
import { GoogleLogo } from "@/components/ui/google-logo"
import { cn } from "@/lib/utils"
import { signupAction } from "@/actions/auth/register"
import type { RegisterState } from "@/types/auth"

export function RegisterForm({ className }: { className?: string }) {
  const initialState: RegisterState = {
    values: undefined,
    error: undefined,
    success: false,
  }
  const [state, formAction, isPending] = useActionState<
    RegisterState,
    FormData
  >(signupAction, initialState)
  const [showPassword, setShowPassword] = useState(false)
  const locale = useLocale()
  const t = useTranslations("Register")
  useEffect(() => {
    if (state.error?.signup) {
      toast.error(t(`messages.${state.error.signup[0]}`))
    }
  }, [state, t])

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
                defaultValue={state.values?.email}
              />
              <div>
                {state.error?.email &&
                  state.error.email.map((error, index) => (
                    <p key={index} className="text-sm text-destructive">
                      {t(`messages.${error}`)}
                    </p>
                  ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="firstPassword">{t("passwordLabel")}</Label>
              <div className="relative">
                <Input
                  id="firstPassword"
                  name="firstPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("passwordPlaceholder")}
                  className="pr-10"
                  defaultValue={state.values?.firstPassword}
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
                {state.error?.firstPassword &&
                  state.error.firstPassword.map((error, index) => (
                    <p key={index} className="text-sm text-destructive">
                      {t(`messages.${error}`)}
                    </p>
                  ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="secondPassword">
                {t("confirmPasswordLabel")}
              </Label>
              <div className="relative">
                <Input
                  id="secondPassword"
                  name="secondPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("confirmPasswordPlaceholder")}
                  className="pr-10"
                  defaultValue={state.values?.secondPassword}
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
                {state.error?.secondPassword &&
                  state.error.secondPassword.map((error, index) => (
                    <p key={index} className="text-sm text-destructive">
                      {t(`messages.${error}`)}
                    </p>
                  ))}
              </div>
              <div></div>
            </div>
          </div>
          <input type="hidden" name="locale" value={locale} />
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-4">
          <Button
            type="submit"
            className="w-full group-invalid:pointer-events-none group-invalid:opacity-50"
            disabled={isPending}
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
          <Button variant="outline" className="w-full" disabled={isPending}>
            <GoogleLogo />
            {t("google")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
