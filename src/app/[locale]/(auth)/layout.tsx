import { cn } from "@/lib/utils"

export default function RootLayout({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <section className={cn("min-h-svh flex items-center justify-center bg-card", className)}>
      {children}
    </section>
  )
}
