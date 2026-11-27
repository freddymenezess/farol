import { Logo } from "@/components/ui/logo"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="flex min-h-svh flex-col items-center bg-card">
      <Logo />
      <div className="flex w-full flex-1 items-center justify-stretch">
        {children}
      </div>
    </section>
  )
}
