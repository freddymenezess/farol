"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { GoogleLogo } from "@/components/ui/google-logo"
import { Spinner } from "@/components/ui/spinner"

export function GoogleButton({ next }: { next?: string }) {
  const [isPending, setIsPending] = useState(false)

  async function handleGoogle() {
    setIsPending(true)

    const supabase = createClient()

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/api/auth/callback?next=${encodeURIComponent(next || "/")}`,
      },
    })

    if (error) {
      console.error(error.message)
      setIsPending(false)
    }
  }

  const t = useTranslations("Login")

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={handleGoogle}
      disabled={isPending}
    >
      {isPending ? (
        <Spinner />
      ) : (
        <>
          <GoogleLogo />
          {t("google")}
        </>
      )}
    </Button>
  )
}
