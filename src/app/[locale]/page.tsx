import { useTranslations } from "next-intl"

export default function Page() {
  const t = useTranslations("Page")

  return (
    <section className="flex min-h-screen flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-primary">{t("title")}</h1>
      <p className="text-lg text-muted-foreground">{t("description")}</p>
    </section>
  )
}
