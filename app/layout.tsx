import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/providers/ThemeProvider"
import { TelegramProvider } from "@/providers/TelegramProvider"
import { Toaster as SonnerToaster } from "@/shared/ui/sonner"
import { Toaster as ShadToaster } from "@/shared/ui/toaster"

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "IT Speed Dating - Революционная платформа знакомств",
  description: "Инновационное приложение для нетворкинга в IT-сообществе",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <style>{`
html {
  font-family: ${inter.style.fontFamily};
  --font-sans: ${inter.variable};
  --font-mono: ${jetbrainsMono.variable};
}
        `}</style>
      </head>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <TelegramProvider>
            {children}
            <SonnerToaster richColors position="top-center" />
            <ShadToaster />
          </TelegramProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
