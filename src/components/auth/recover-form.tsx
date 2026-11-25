"use client"

import { useActionState } from "react"
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button, buttonVariants } from "@/components/ui/button"
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
import { toast } from "sonner"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { requestPasswordRecoveryAction } from "@/actions/auth/recover-action"
import type { RequestPasswordRecoveryState } from "@/types/auth-type"

export function RecoverForm({ className }: { className?: string }) {
  const initialState: RequestPasswordRecoveryState = {
    success: false,
    error: "",
  }
  const [state, formAction, isPending] = useActionState<
    RequestPasswordRecoveryState,
    FormData
  >(requestPasswordRecoveryAction, initialState)
  const searchParams = useSearchParams()
  const error = searchParams.get("error") || undefined
  const t = useTranslations("Recover")

  useEffect(() => {
    if (error) {
      toast.error(t("messages.ERROR"))
    } else if (!state.success && state.error) {
      toast.error(t(`messages.${state.error}`))
    } else if (state.success) {
      toast.success(t(`messages.SUCCESS`))
    }
  }, [state, t, error])

  return (
    <Card className={cn("w-full max-w-md shadow-none ring-0", className)}>
      <form
        className="group flex flex-col gap-(--card-spacing)"
        action={formAction}
      >
        <CardHeader>
          <CardTitle className="col-span-2 text-xl font-semibold">
            {t("title")}
          </CardTitle>
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
                required
              />
            </div>
          </div>
          <CardDescription className="col-span-2">
            {t("description")}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-2">
          <Button
            type="submit"
            className="w-full group-invalid:pointer-events-none group-invalid:opacity-50"
            isPending={isPending}
            disabled={isPending}
            spinner
          >
            {t("submit")}
          </Button>
          <Link
            href="/sign/in"
            className={buttonVariants({ variant: "ghost" })}
          >
            {t("backToLogin")}
          </Link>
        </CardFooter>
      </form>
    </Card>
  )
}
