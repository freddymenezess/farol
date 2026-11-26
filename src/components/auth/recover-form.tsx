"use client"

import { useActionState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { requestPasswordRecoveryAction } from "@/actions/auth/recover-action"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

import type { RequestPasswordRecoveryState } from "@/types/auth-type"

const initialState: RequestPasswordRecoveryState = {
  success: false,
  error: "",
}

export function RecoverForm({ className }: { className?: string }) {
  const t = useTranslations("Recover")
  const [state, formAction, isPending] = useActionState<
    RequestPasswordRecoveryState,
    FormData
  >(requestPasswordRecoveryAction, initialState)

  const searchParams = useSearchParams()
  const urlError = searchParams.get("error") || undefined

  useEffect(() => {
    if (urlError) {
      toast.error(t("messages.ERROR"))
    } else if (!state.success && state.error) {
      toast.error(t(`messages.${state.error}`))
    } else if (state.success) {
      toast.success(t("messages.SUCCESS"))
    }
  }, [state, t, urlError])

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
              <FieldLabel htmlFor="email">{t("emailLabel")}</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder={t("emailPlaceholder")}
              />
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
