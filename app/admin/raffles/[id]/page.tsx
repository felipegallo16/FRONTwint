"use client"

import React, { useState, useEffect } from "react"
import { getRaffleById, updateRaffle } from "@/lib/api"
import type { Sorteo, EstadoSorteo, ActualizacionEstado } from "@/types/sorteo"
import { useI18n } from "@/contexts/i18n-context"
import { ArrowLeft, AlertCircle, Save } from "lucide-react"
import Link from "next/link"
import { useNotifications } from "@/components/notifications"

export default function RaffleDetail({ params }: { params: Promise<{ id: string }> }) {
  const { t } = useI18n()
  const { showNotification } = useNotifications()
  const { id } = React.use(params)
  const [sorteo, setSorteo] = useState<Sorteo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        console.log("Fetching raffle with ID:", id)
        const data = await getRaffleById(id)
        console.log("Raffle data received:", data)
        setSorteo(data)
      } catch (error: any) {
        console.error("Error al cargar datos:", error)
        setError(error.message || "Error al cargar datos")
        setSorteo(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleStatusChange = async (newStatus: EstadoSorteo) => {
    if (!sorteo) return

    setIsUpdating(true)
    try {
      const updateData: ActualizacionEstado = {
        configuracion: {
          estado: newStatus
        }
      }
      console.log("Current raffle state:", sorteo.configuracion.estado)
      console.log("Attempting to change to:", newStatus)
      console.log("Update data being sent:", updateData)
      
      await updateRaffle(id, updateData)
      
      // Actualizar el estado local manteniendo los datos existentes
      setSorteo(prev => {
        if (!prev) return null
        return {
          ...prev,
          configuracion: {
            ...prev.configuracion,
            estado: newStatus
          }
        }
      })
      
      showNotification("success", t("raffles.statusUpdated", "raffles"))
    } catch (error: any) {
      console.error("Error updating status:", error)
      showNotification("error", error.message || t("raffles.errorUpdatingStatus", "raffles"))
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-t-2 border-wt-primary rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
        <Link href="/admin/raffles" className="text-wt-primary hover:underline flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("common.back", "common")}
        </Link>
      </div>
    )
  }

  if (!sorteo) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <p className="text-yellow-700 dark:text-yellow-300">{t("raffles.notFound", "raffles")}</p>
        </div>
        <Link href="/admin/raffles" className="text-wt-primary hover:underline flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("common.back", "common")}
        </Link>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/raffles" className="text-wt-primary hover:underline flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("common.back", "common")}
        </Link>
      </div>

      <div className="card">
        <h1 className="text-2xl font-bold mb-4 text-wt-text">{sorteo.nombre}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-2 text-wt-text">{t("raffles.details", "raffles")}</h2>
            <div className="space-y-2">
              <p className="text-wt-text-secondary">{sorteo.descripcion}</p>
              
              {/* Selector de estado */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-wt-text mb-2">
                  {t("raffles.status", "raffles")}
                </label>
                <div className="flex gap-2">
                  <select
                    value={sorteo.configuracion.estado}
                    onChange={(e) => handleStatusChange(e.target.value as EstadoSorteo)}
                    disabled={isUpdating}
                    className="flex-1 p-2 rounded-lg border border-wt-border bg-wt-background text-wt-text focus:outline-none focus:ring-2 focus:ring-wt-primary"
                  >
                    <option value="ACTIVO">{t("raffles.status.activo", "raffles")}</option>
                    <option value="PAUSADO">{t("raffles.status.pausado", "raffles")}</option>
                    <option value="FINALIZADO">{t("raffles.status.finalizado", "raffles")}</option>
                  </select>
                  {isUpdating && (
                    <div className="w-8 h-8 border-t-2 border-wt-primary rounded-full animate-spin"></div>
                  )}
                </div>
              </div>

              <p className="text-wt-text">
                <span className="font-medium">{t("raffles.pricePerNumber", "raffles")}:</span>{" "}
                {sorteo.configuracion.precio_por_numero} WLD
              </p>
              <p className="text-wt-text">
                <span className="font-medium">{t("raffles.totalNumbers", "raffles")}:</span>{" "}
                {sorteo.configuracion.total_numeros}
              </p>
              <p className="text-wt-text">
                <span className="font-medium">{t("raffles.soldNumbers", "raffles")}:</span>{" "}
                {sorteo.numeros_vendidos?.length || 0}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2 text-wt-text">{t("raffles.prize", "raffles")}</h2>
            <div className="space-y-2">
              <p className="text-wt-text">
                <span className="font-medium">{t("raffles.prizeType", "raffles")}:</span>{" "}
                {t(`raffles.prizeType.${sorteo.premio.tipo.toLowerCase()}`, "raffles")}
              </p>
              {sorteo.premio.tipo === "MATERIAL" && (
                <>
                  <p className="text-wt-text">
                    <span className="font-medium">{t("raffles.prizeDescription", "raffles")}:</span>{" "}
                    {sorteo.premio.descripcion}
                  </p>
                  <p className="text-wt-text">
                    <span className="font-medium">{t("raffles.prizeValue", "raffles")}:</span>{" "}
                    {sorteo.premio.valor} {sorteo.premio.moneda}
                  </p>
                </>
              )}
              {sorteo.premio.tipo === "TOKEN" && (
                <>
                  <p className="text-wt-text">
                    <span className="font-medium">{t("raffles.tokenAmount", "raffles")}:</span>{" "}
                    {sorteo.premio.cantidad} {sorteo.premio.token}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}