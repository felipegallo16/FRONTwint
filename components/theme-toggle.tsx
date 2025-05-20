"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-wt-card border border-wt-card-border">
        <div className="w-5 h-5"></div>
      </div>
    )
  }

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="w-10 h-10 rounded-full flex items-center justify-center bg-wt-card border border-wt-card-border"
      aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
    >
      {theme === "light" ? <Moon className="w-5 h-5 text-wt-text" /> : <Sun className="w-5 h-5 text-wt-text" />}
    </motion.button>
  )
}
