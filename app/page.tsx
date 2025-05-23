"use client"

import { useEffect, useState, Suspense, lazy } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Navigation from "@/components/navigation"
import { useWorldAppAuth } from "@/components/world-app-integration"
import { AnimatedStagger, AnimatedStaggerItem, AnimatedSlideUp } from "@/components/animated-components"
import { getRaffles } from "@/lib/api"
import type { Sorteo } from "@/types/sorteo"
import { AlertCircle } from "lucide-react"

const RaffleCard = lazy(() => import("@/components/raffle-card"))

export default function Home() {
  const { isWorldIDVerified, isDemoMode } = useWorldAppAuth()
  const router = useRouter()
  const [raffles, setRaffles] = useState<Sorteo[]>([])
  const [isLoadingRaffles, setIsLoadingRaffles] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isWorldIDVerified && !isDemoMode) {
      router.push("/login")
    }
  }, [isWorldIDVerified, isDemoMode, router])

  useEffect(() => {
    const fetchRaffles = async () => {
      if (!isWorldIDVerified && !isDemoMode) return
      setIsLoadingRaffles(true)
      setError(null)
      try {
        if (isDemoMode) {
          console.log("Usando datos de muestra para los sorteos")
          await new Promise((resolve) => setTimeout(resolve, 1000))
          setRaffles([])
          return
        }

        console.log("Obteniendo datos reales de los sorteos")
        const data = await getRaffles()
        // Filtrar solo sorteos activos y finalizados
        const filteredRaffles = data.filter(
          (raffle) => raffle.configuracion.estado === "ACTIVO" || raffle.configuracion.estado === "FINALIZADO"
        )
        setRaffles(filteredRaffles)
      } catch (error: any) {
        console.error("Error al cargar sorteos:", error)
        setError(error.message || "No se pudieron cargar los sorteos")
        setRaffles([])
      } finally {
        setIsLoadingRaffles(false)
      }
    }

    fetchRaffles()
  }, [isWorldIDVerified, isDemoMode])

  if (isLoadingRaffles) {
    return (
      <main>
        <Header />
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-t-2 border-wt-primary rounded-full animate-spin"></div>
        </div>
        <Navigation />
      </main>
    )
  }

  return (
    <main>
      <Header />
      <div className="p-4 max-w-4xl mx-auto">
        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {raffles.length === 0 ? (
          <div className="text-center py-8 text-wt-text-secondary">
            No hay sorteos disponibles en este momento
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {raffles.map((raffle) => (
              <RaffleCard key={raffle.id} {...raffle} />
            ))}
          </div>
        )}
      </div>
      <Navigation />
    </main>
  )
}