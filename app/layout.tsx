import { I18nProvider } from "@/contexts/i18n-context"
import { ThemeProvider } from "@/components/theme-provider"
import MiniKitProvider from "@/components/minikit-provider"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import type { ReactNode } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "WinTrust - Sorteos transparentes con World ID",
  description: "Plataforma de sorteos transparentes verificados con World ID",
  generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <I18nProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <MiniKitProvider appId="app_7ec5fc1205e05862fcd2ecd6f8bdb0ab">
              {children}
            </MiniKitProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  )
}