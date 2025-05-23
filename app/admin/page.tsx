"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Gift, Users, TrendingUp, Clock, AlertCircle, BarChart } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/contexts/i18n-context"
import StatsCard from "@/components/admin/stats-card"
import { getRaffles } from "@/lib/api"
import type { Sorteo } from "@/types/sorteo"

export default function AdminDashboard() {
  const { t } = useI18n()
  const [sorteos, setSorteos] = useState<Sorteo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Obtener datos reales del backend
        const data = await getRaffles()
        setSorteos(data)
      } catch (error: any) {
        console.error("Error al cargar datos:", error)
        setError(error.message || "Error al cargar datos")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calcular estadísticas
  const totalRaffles = sorteos.length
  const activeRaffles = sorteos.filter((sorteo) => sorteo.configuracion.estado === "ACTIVO").length
  const totalParticipants = new Set(
    sorteos.flatMap((sorteo) => sorteo.numeros_vendidos.map((num) => `user_${num % 100}`)),
  ).size
  const totalRevenue = sorteos.reduce(
    (sum, sorteo) => sum + sorteo.numeros_vendidos.length * sorteo.configuracion.precio_por_numero,
    0,
  )

  // Sorteos recientes
  const recentRaffles = [...sorteos]
    .sort((a, b) => new Date(b.fecha_actualizacion).getTime() - new Date(a.fecha_actualizacion).getTime())
    .slice(0, 5)

  return (
    <div className="p-4 max-w-md mx-auto">
      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title={t("admin.totalRaffles", "common")}
          value={totalRaffles}
          icon={Gift}
          color="blue"
          href="/admin/raffles"
        />
        <StatsCard
          title={t("admin.activeRaffles", "common")}
          value={activeRaffles}
          icon={Clock}
          color="green"
          href="/admin/raffles?status=active"
        />
        <StatsCard
          title={t("admin.totalParticipants", "common")}
          value={totalParticipants}
          icon={Users}
          color="purple"
          href="/admin/users"
        />
        <StatsCard
          title={t("admin.totalRevenue", "common")}
          value={`${totalRevenue} WLD`}
          icon={TrendingUp}
          color="amber"
          href="/admin/stats"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4 text-wt-text">{t("admin.recentRaffles", "common")}</h2>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-t-2 border-wt-primary rounded-full animate-spin"></div>
            </div>
          ) : recentRaffles.length > 0 ? (
            <div className="space-y-4">
              {recentRaffles.map((sorteo) => (
                <motion.div
                  key={sorteo.id}
                  className="p-4 bg-wt-background rounded-lg flex items-center justify-between"
                  whileHover={{ x: 5 }}
                >
                  <div>
                    <h3 className="font-medium text-wt-text">{sorteo.nombre}</h3>
                    <p className="text-sm text-wt-text-secondary">
                      {t("raffles.status." + sorteo.configuracion.estado.toLowerCase(), "raffles")} •{" "}
                      {sorteo.numeros_vendidos.length}/{sorteo.configuracion.total_numeros} {t("admin.sold", "common")}
                    </p>
                  </div>
                  <Link href={`/admin/raffles/${sorteo.id}`} className="text-wt-primary text-sm hover:underline">
                    {t("admin.view", "common")}
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-wt-text-secondary py-4 text-center">{t("admin.noRaffles", "common")}</p>
          )}
          <div className="mt-4 text-right">
            <Link href="/admin/raffles" className="text-wt-primary hover:underline">
              {t("admin.viewAll", "common")}
            </Link>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4 text-wt-text">{t("admin.quickActions", "common")}</h2>
          <div className="space-y-3">
            <Link href="/admin/raffles/create">
              <motion.div
                className="p-4 bg-wt-background rounded-lg flex items-center gap-3 hover:bg-wt-primary/10 transition-colors"
                whileHover={{ x: 5 }}
              >
                <div className="w-10 h-10 bg-wt-primary/10 rounded-full flex items-center justify-center">
                  <Gift className="w-5 h-5 text-wt-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-wt-text">{t("admin.createRaffle", "common")}</h3>
                  <p className="text-sm text-wt-text-secondary">{t("admin.createRaffleDesc", "common")}</p>
                </div>
              </motion.div>
            </Link>
            <Link href="/admin/users">
              <motion.div
                className="p-4 bg-wt-background rounded-lg flex items-center gap-3 hover:bg-wt-primary/10 transition-colors"
                whileHover={{ x: 5 }}
              >
                <div className="w-10 h-10 bg-wt-primary/10 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-wt-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-wt-text">{t("admin.manageUsers", "common")}</h3>
                  <p className="text-sm text-wt-text-secondary">{t("admin.manageUsersDesc", "common")}</p>
                </div>
              </motion.div>
            </Link>
            <Link href="/admin/stats">
              <motion.div
                className="p-4 bg-wt-background rounded-lg flex items-center gap-3 hover:bg-wt-primary/10 transition-colors"
                whileHover={{ x: 5 }}
              >
                <div className="w-10 h-10 bg-wt-primary/10 rounded-full flex items-center justify-center">
                  <BarChart className="w-5 h-5 text-wt-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-wt-text">{t("admin.viewStats", "common")}</h3>
                  <p className="text-sm text-wt-text-secondary">{t("admin.viewStatsDesc", "common")}</p>
                </div>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}