import { HugeiconsIcon } from "@hugeicons/react"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { RadioGroupItem } from "@/components/ui/radio-group"

import type { IconSvgElement } from "@hugeicons/react"
import type { OnboardingRole } from "@/generated/prisma/enums"

interface RoleOptionProps {
  value: OnboardingRole
  title: string
  description: string
  icon: IconSvgElement
}

// Tem de estar dentro de um <RadioGroup>. O estado selecionado (borda e fundo
// em `primary`) vem do próprio FieldLabel do shadcn.
export function RoleOption({
  value,
  title,
  description,
  icon,
}: RoleOptionProps) {
  const id = `role-${value}`

  return (
    <FieldLabel htmlFor={id}>
      <Field orientation="horizontal">
        <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-transparent text-primary">
          <HugeiconsIcon icon={icon} className="mt-4 size-6" />
        </div>
        <FieldContent>
          <FieldTitle>{title}</FieldTitle>
          <FieldDescription>{description}</FieldDescription>
        </FieldContent>
        <RadioGroupItem value={value} id={id} />
      </Field>
    </FieldLabel>
  )
}
