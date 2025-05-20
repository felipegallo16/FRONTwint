"use client"

import { useState, useEffect } from "react"
import { Loader2, Eye, LogIn, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { AnimatedSlideUp, AnimatedScale } from "@/components/animated-components"
import { motion } from "framer-motion"
import WinTrustLogo from "@/components/wintrust-logo"
import { useI18n } from "@/contexts/i18n-context"
import { useWorldAppAuth } from "@/components/world-app-integration"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { t } = useI18n()
  const { isWorldIDVerified, isLoading: authLoading, verifyWithWorldID, setIsDemoMode } = useWorldAppAuth()

  // Redirigir si ya está autenticado
  useEffect(() => {
    console.log("isWorldIDVerified:", isWorldIDVerified)
    if (isWorldIDVerified) {
      console.log("Redirigiendo a /")
      router.push("/")
    }
  }, [isWorldIDVerified, router])

  const handleConnectWithWorld = async () => {
    setIsLoading(true)
    setErrorMessage(null)
    try {
      console.log("Iniciando autenticación con World App...")
      const result = await verifyWithWorldID()
      if (result.success) {
        toast.success(t("authSuccess", "common") || "¡Autenticación exitosa!")
        router.push("/")
      } else {
        throw new Error(result.error || "No se pudo autenticar con World App")
      }
    } catch (error) {
      console.error("Error de autenticación:", error)
      const errorMsg = error instanceof Error ? error.message : "No se pudo conectar con World App"
      setErrorMessage(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoMode = () => {
    setIsLoading(true)
    setErrorMessage(null)
    setIsDemoMode(true)
    toast.success(t("demoModeActivated", "common") || "Modo de vista previa activado")
    setTimeout(() => {
      router.push("/")
      setIsLoading(false)
    }, 1000)
  }

  return (
    <main
      id="main-content"
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-6"
    >
      <div className="w-full max-w-md flex flex-col items-center">
        <AnimatedScale>
          <motion.div
            className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-lg"
            whileHover={{
              rotate: [0, -5, 5, -5, 0],
              transition: {
                duration: 0.5,
                ease: "easeInOut",
                times: [0, 0.25, 0.5, 0.75, 1],
                repeatType: "loop",
                repeat: 0,
              },
            }}
            animate={{
              scale: [1, 1.05, 1],
              boxShadow: [
                "0px 0px 0px rgba(0,0,0,0.1)",
                "0px 10px 20px rgba(0,0,0,0.2)",
                "0px 0px 0px rgba(0,0,0,0.1)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            <WinTrustLogo size={60} showText={false} variant="default" />
          </motion.div>
        </AnimatedScale>

        <AnimatedSlideUp delay={0.05}>
          <motion.h1
            className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent drop-shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
            whileHover={{
              scale: 1.05,
              textShadow: "0px 0px 8px rgba(59, 130, 246, 0.5)",
            }}
          >
            WinTrust
          </motion.h1>
        </AnimatedSlideUp>

        <AnimatedSlideUp delay={0.2}>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-10">
            {t("tagline", "common") || "Sorteos transparentes con World ID"}
          </p>
        </AnimatedSlideUp>

        <AnimatedScale delay={0.3} className="w-full">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full mb-8 p-6">
            <h2 className="font-bold text-xl mb-4 text-center text-gray-800 dark:text-white">
              {t("welcome", "common") || "Bienvenido"}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
              {t("connectWithWorldApp", "common") || "Conecta con World App"}
            </p>

            {errorMessage && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 dark:text-red-300 text-sm">{errorMessage}</p>
              </div>
            )}

            <div className="space-y-4">
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
                onClick={handleConnectWithWorld}
                disabled={isLoading || authLoading}
              >
                {isLoading || authLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
                    <span>{t("connecting", "common") || "Conectando..."}</span>
                    <span className="sr-only">{t("connecting", "common") || "Conectando..."}</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" aria-hidden="true" />
                    <span>{t("connectWithWorldApp", "common") || "Conectar con World App"}</span>
                  </>
                )}
              </button>

              <button
                className="w-full bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
                onClick={handleDemoMode}
                disabled={isLoading || authLoading}
              >
                <Eye className="w-5 h-5 mr-2" aria-hidden="true" />
                <span>{t("previewMode", "common") || "Modo de vista previa"}</span>
              </button>
            </div>
          </div>
        </AnimatedScale>

        <AnimatedSlideUp delay={0.4}>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center font-medium">
            {t("byUsing", "common") || "Al usar este servicio, aceptas nuestros"}{" "}
            <a href="/terms" className="text-blue-600 hover:underline font-bold">
              {t("terms", "common") || "Términos"}
            </a>{" "}
            {t("and", "common") || "y"}{" "}
            <a href="/privacy" className="text-blue-600 hover:underline font-bold">
              {t("privacy", "common") || "Privacidad"}
            </a>
          </p>
        </AnimatedSlideUp>
      </div>
    </main>
  )
}