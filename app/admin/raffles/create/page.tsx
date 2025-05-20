"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Save, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/contexts/i18n-context"
import RaffleForm from "@/components/admin/raffle-form"
import { useNotifications } from "@/components/notifications"
import type { Sorteo } from "@/types/sorteo"

export default function CreateRaffle() {
  const { t } = useI18n()
  const router = useRouter()
  const { showNotification } = useNotifications()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (raffleData: Partial<Sorteo>) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // En una implementación real, aquí se procesaría la imagen y se enviarían los datos al backend
      console.log("Datos del sorteo a crear:", raffleData)

      // Simular una petición al backend
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mostrar notificación de éxito
      showNotification("success", t("admin.raffleCreatedSuccess", "common"))

      // Redirigir a la lista de sorteos
      router.push("/admin/raffles")
    } catch (error: any) {
      console.error("Error al crear sorteo:", error)
      setError(error.message || t("admin.errorCreatingRaffle", "common"))
      showNotification("error", t("admin.errorCreatingRaffle", "common"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link href="/admin/raffles" className="mr-4">
          <motion.div whileHover={{ x: -3 }} whileTap={{ scale: 0.97 }}>
            <ArrowLeft className="w-5 h-5 text-wt-text-secondary" />
          </motion.div>
        </Link>
        <h2 className="text-xl font-bold text-wt-text">{t("admin.createNewRaffle", "common")}</h2>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      <div className="card">
        <RaffleForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitButtonText={
            <>
              <Save className="w-5 h-5 mr-2" />
              {t("admin.createRaffle", "common")}
            </>
          }
        />
      </div>
    </div>
  )
}
