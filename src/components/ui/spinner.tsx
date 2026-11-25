import { cn } from "cn"
import { HugeiconsIcon } from "@hugeicons/react"
import { LoaderCircleIcon  } from "@hugeicons/core-free-icons"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <HugeiconsIcon icon={LoaderCircleIcon } strokeWidth={2} data-slot="spinner" role="status" aria-label="Loading" className={cn("size-4 animate-spin", className)} {...props} />
  )
}

export { Spinner }
