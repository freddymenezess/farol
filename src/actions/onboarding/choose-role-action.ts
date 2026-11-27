"use server"

import { z } from "zod"

import { redirect } from "@/i18n/navigation"
import { requireUser } from "@/lib/supabase/user"
import { resolveDestination } from "@/services/auth/resolve-destination-service"
import { chooseRoleService } from "@/services/onboarding/choose-role-service"
import { Prisma } from "@/generated/prisma/client"
import { OnboardingRole } from "@/generated/prisma/enums"

import type { Locale } from "@/types/next-intl-type"

const roleSchema = z.enum(OnboardingRole)

export async function chooseRole(locale: Locale, formData: FormData) {
  const { id } = await requireUser(locale)

  const parsed = roleSchema.safeParse(formData.get("role"))

  if (!parsed.success) {
    return {
      success: false as const,
      error: "NO_ROLE_SELECTED",
    }
  }

  const role = parsed.data

  try {
    await chooseRoleService(id, role)
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return { success: false as const, error: "DRAFT_EXPIRED" }
    }

    console.error("Falha ao guardar o role", error)
    return { success: false as const, error: "FAILED_SAVE_ROLE" }
  }
    
  const href = await resolveDestination(id)

  redirect({ href, locale })
}
