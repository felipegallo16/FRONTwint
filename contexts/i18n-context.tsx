"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Definir los tipos para las traducciones
type Translations = {
  [key: string]: {
    [key: string]: string
  }
}

// Traducciones iniciales
const translations: Translations = {
  es: {
    "common.welcome": "Bienvenido",
    "common.tagline": "Sorteos transparentes con World ID",
    "common.connectWithWorldApp": "Conectar con World App",
    "common.connecting": "Conectando...",
    "common.previewMode": "Modo de vista previa",
    "common.byUsing": "Al usar este servicio, aceptas nuestros",
    "common.terms": "Términos",
    "common.and": "y",
    "common.privacy": "Privacidad",
  },
  en: {
    "common.welcome": "Welcome",
    "common.tagline": "Transparent raffles with World ID",
    "common.connectWithWorldApp": "Connect with World App",
    "common.connecting": "Connecting...",
    "common.previewMode": "Preview Mode",
    "common.byUsing": "By using this service, you agree to our",
    "common.terms": "Terms",
    "common.and": "and",
    "common.privacy": "Privacy",
  },
}

// Crear el contexto
type I18nContextType = {
  locale: string
  setLocale: (locale: string) => void
  t: (key: string, namespace?: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

// Proveedor del contexto
export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState("es") // Español por defecto

  const t = (key: string, namespace = "common") => {
    const fullKey = `${namespace}.${key}`
    return translations[locale]?.[fullKey] || key
  }

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>
}

// Hook para usar el contexto
export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
