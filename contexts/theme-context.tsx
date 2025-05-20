"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  systemTheme: Theme | null
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  systemTheme: null,
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")
  const [systemTheme, setSystemTheme] = useState<Theme | null>(null)
  const [mounted, setMounted] = useState(false)

  // Detectar preferencia del sistema al cargar
  useEffect(() => {
    setMounted(true)
    // Verificar si estamos en el cliente
    if (typeof window !== "undefined") {
      // Recuperar tema guardado o usar preferencia del sistema
      const savedTheme = localStorage.getItem("wintrust-theme") as Theme | null

      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      const systemPreference: Theme = prefersDark ? "dark" : "light"

      setSystemTheme(systemPreference)

      if (savedTheme) {
        setTheme(savedTheme)
        document.documentElement.classList.toggle("dark", savedTheme === "dark")
      } else {
        setTheme(systemPreference)
        document.documentElement.classList.toggle("dark", systemPreference === "dark")
      }
    }
  }, [])

  // Escuchar cambios en la preferencia del sistema
  useEffect(() => {
    if (!mounted) return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = (e: MediaQueryListEvent) => {
      const newSystemTheme: Theme = e.matches ? "dark" : "light"
      setSystemTheme(newSystemTheme)

      // Solo cambiar el tema si el usuario no ha establecido una preferencia
      if (!localStorage.getItem("wintrust-theme")) {
        setTheme(newSystemTheme)
        document.documentElement.classList.toggle("dark", newSystemTheme === "dark")
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [mounted])

  const toggleTheme = () => {
    if (!mounted) return

    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("wintrust-theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  // Evitar problemas de hidratación
  if (!mounted) {
    return <>{children}</>
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme, systemTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  return context
}
