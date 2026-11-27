import { cn } from "@/lib/utils"

export function Logo({ className } : { className?: string }) {
  return (
    <div className={cn("w-full bg-transparent flex items-center justify-center md:justify-start p-6", className)}>
      <p className="font-heading font-extrabold text-primary text-4xl">Farol</p>
    </div>
  )
}