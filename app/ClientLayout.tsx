"use client"

import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/contexts/theme-context"
import { I18nProvider } from "@/contexts/i18n-context"
import { NotificationsProvider } from "@/components/notifications"
import { useState, useEffect } from "react"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <I18nProvider>
          <ThemeProvider>
            <ErrorBoundary fallback={<div className="p-4">Ha ocurrido un error. Por favor, recarga la página.</div>}>
              <NotificationsProvider>{children}</NotificationsProvider>
            </ErrorBoundary>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  )
}

// Componente simple de límite de error
function ErrorBoundary({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const errorHandler = () => setHasError(true)
    window.addEventListener("error", errorHandler)
    return () => window.removeEventListener("error", errorHandler)
  }, [])

  return hasError ? fallback : children
}
