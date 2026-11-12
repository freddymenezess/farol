import { Geist, Geist_Mono, Figtree } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"

import { NextIntlClientProvider } from "next-intl"
import { routing } from "@/i18n/routing"

const geistHeading = Geist({ subsets: ["latin"], variable: "--font-heading" })
const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" })
const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        figtree.variable,
        geistHeading.variable
      )}
    >
      <body className="min-h-svh bg-secondary">
        <NextIntlClientProvider locale={locale}>
          <ThemeProvider>
            {children} 
            <Toaster position="top-left" />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
