"use client"

import { useTransition } from "react"
import { TelegramIcon, Home04Icon } from "@hugeicons/core-free-icons"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { RoleOption } from "@/components/onboarding/role-option"
import { Button } from "@/components/ui/button"
import { RadioGroup } from "@/components/ui/radio-group"
import { chooseRole } from "@/actions/onboarding/choose-role-action"
import { cn } from "@/lib/utils"

import type { Locale } from "@/types/next-intl-type"

export function ChoosePaperForm({
  className,
  locale,
}: {
  className?: string
  locale: Locale
}) {
  const t = useTranslations("Paper")
  const [isPending, startTransition] = useTransition()

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      const state = await chooseRole(locale, formData)

      if (state.error) toast.error(state.error)
    })
  }

  return (
    <div className={cn("flex items-center p-6", className)}>
      <div className="mx-auto flex w-full max-w-md flex-col gap-8">
        <header className="flex flex-col gap-2">
          <h1 id="role-title" className="font-heading text-xl font-semibold">
            {t("title")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <RadioGroup
            name="role"
            defaultValue="EMIGRANT"
            aria-labelledby="role-title"
            className="gap-4"
          >
            <RoleOption
              value="EMIGRANT"
              title={t("emigrant.title")}
              description={t("emigrant.description")}
              icon={TelegramIcon}
            />
            <RoleOption
              value="HOST"
              title={t("host.title")}
              description={t("host.description")}
              icon={Home04Icon}
            />
          </RadioGroup>

          <Button type="submit" disabled={isPending} spinner={isPending}>
            {t("continue")}
          </Button>
        </form>
      </div>
    </div>
  )
}
