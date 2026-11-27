import { Geist, Geist_Mono, Figtree } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"

import { NextIntlClientProvider } from "next-intl"
import { routing } from "@/i18n/routing"

import type { Locale } from "@/types/next-intl-type"
import type { Metadata } from "next"

const geist = Geist({ subsets: ["latin"], variable: "--font-heading" })
const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" })
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  title: "Farol",
  description:
    "Encontra pessoas com os mesmos destinos e objectivos, partilha experiências e constrói novas ligações.",
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
}>) {
  const { locale } = await params

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn(
        "antialiased",
        geistMono.variable,
        "font-sans",
        figtree.variable,
        geist.variable
      )}
    >
      <body className="min-h-svh bg-secondary">
        <NextIntlClientProvider locale={locale}>
          <ThemeProvider>
            {children}
            <Toaster position="top-right" />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
