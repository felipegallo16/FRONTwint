"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Trophy, AlertCircle, Check, Clock } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import Navigation from "@/components/navigation"
import { useWorldAppAuth } from "@/components/world-app-integration"
import { AnimatedScale, AnimatedSlideUp } from "@/components/animated-components"
import { getSorteoById, getGanadorSorteo } from "@/services/api"
import { useApiAvailability } from "@/hooks/useApi"
import type { Sorteo } from "@/types/sorteo"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { motion } from "framer-motion"

export default function RaffleResults({ params }: { params: { id: string } }) {
  const [sorteo, setSorteo] = useState<Sorteo | null>(null)
  const [ganador, setGanador] = useState<{ numero: number; nullifier_hash_masked: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isDemoMode } = useWorldAppAuth()
  const { isApiAvailable, isChecking } = useApiAvailability()

  useEffect(() => {
    const fetchRaffleResults = async () => {
      setIsLoading(true)
      setError(null)

      try {
        if (isDemoMode || !isApiAvailable) {
          setError("No se puede acceder a los resultados del sorteo en este momento")
          return
        }
        const sorteoResponse = await getSorteoById(params.id)
        if (sorteoResponse.error || !sorteoResponse.data) {
          throw new Error(sorteoResponse.error || "No se encontraron datos del sorteo")
        }
        setSorteo(sorteoResponse.data)

        const ganadorResponse = await getGanadorSorteo(params.id)
        if (ganadorResponse.error || !ganadorResponse.data) {
          throw new Error(ganadorResponse.error || "No se encontraron datos del ganador")
        }
        setGanador(ganadorResponse.data)
      } catch (error: any) {
        console.error("Error al cargar resultados del sorteo:", error)
        setError(error.message || "No se pudieron cargar los resultados del sorteo")
        setSorteo({
          id: params.id,
          nombre: "Sorteo Finalizado",
          descripcion: "Este es un sorteo de ejemplo para mostrar resultados.",
          tipo: "MATERIAL",
          premio: {
            tipo: "MATERIAL",
            descripcion: "Premio de Ejemplo",
            valor: 100,
            moneda: "USD",
          },
          configuracion: {
            precio_por_numero: 3,
            total_numeros: 100,
            fecha_fin: new Date(),
            estado: "FINALIZADO",
          },
          numeros_vendidos: [],
          creado_por: "sistema",
          fecha_creacion: new Date(),
          fecha_actualizacion: new Date(),
          ganador: {
            numero: 42,
            nullifier_hash: "0xabcdef",
          },
        })
        setGanador({
          numero: 42,
          nullifier_hash_masked: "0xabc...def",
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchRaffleResults()
  }, [params.id, isDemoMode, isApiAvailable, isChecking])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-wt-background">
        <Header />
        <div className="flex justify-center items-center h-[80vh]">
          <motion.div
            className="w-10 h-10 border-t-2 border-wt-primary rounded-full animate-spin"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          ></motion.div>
        </div>
        <Navigation />
      </div>
    )
  }

  if (!sorteo) {
    return (
      <div className="min-h-screen bg-wt-background">
        <Header />
        <div className="p-4 max-w-md mx-auto">
          <AnimatedScale className="card p-8 text-center">
            <p className="text-wt-text-secondary">Sorteo no encontrado.</p>
          </AnimatedScale>
        </div>
        <Navigation />
      </div>
    )
  }

  const getPremioTexto = () => {
    if (sorteo.tipo === "TOKEN") {
      return `${sorteo.premio.tipo === "TOKEN" ? `${sorteo.premio.cantidad} ${sorteo.premio.token}` : ""}`
    } else {
      return sorteo.premio.tipo === "MATERIAL" ? sorteo.premio.descripcion : ""
    }
  }

  const fechaFormateada = format(new Date(sorteo.configuracion.fecha_fin), "dd/MM/yyyy", { locale: es })

  return (
    <main className="min-h-screen pb-24 bg-wt-background">
      <Header />
      <div className="p-4 max-w-md mx-auto">
        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4 flex items-center text-sm text-red-800 dark:text-red-300">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        <AnimatedSlideUp>
          <Link href="/" className="flex items-center text-wt-text-secondary mb-6">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver a sorteos
          </Link>
        </AnimatedSlideUp>
        <AnimatedScale className="mb-6">
          <h1 className="font-bold text-xl mb-2 text-wt-text">Resultados del Sorteo</h1>
          <p className="text-wt-text-secondary">{sorteo.nombre}</p>
        </AnimatedScale>
        <AnimatedScale delay={0.1} className="card mb-6">
          <div className="flex items-center gap-4 mb-5">
            <motion.div
              className="w-14 h-14 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Trophy className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </motion.div>
            <div>
              <h2 className="font-bold text-lg text-wt-text">Sorteo Finalizado</h2>
              <p className="text-wt-text-secondary text-sm">
                <Clock className="w-4 h-4 inline-block mr-1" />
                {fechaFormateada}
              </p>
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-5 mb-6 text-center">
            <p className="text-blue-700 dark:text-blue-300 text-sm mb-2">Número Ganador</p>
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {ganador?.numero || sorteo.ganador?.numero || "N/A"}
            </div>
            <p className="text-xs text-blue-500 dark:text-blue-300">
              ID: {ganador?.nullifier_hash_masked || "Anónimo"}
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-wt-text-secondary">Premio:</span>
              <span className="font-bold text-wt-text">{getPremioTexto()}</span>
            </div>
            {sorteo.tipo === "TOKEN" && sorteo.premio_acumulado && (
              <div className="flex justify-between">
                <span className="text-wt-text-secondary">Premio Acumulado:</span>
                <span className="font-bold text-amber-500">
                  +{sorteo.premio_acumulado} {sorteo.premio.tipo === "TOKEN" ? sorteo.premio.token : ""}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-wt-text-secondary">Precio por Número:</span>
              <span className="text-wt-text">{sorteo.configuracion.precio_por_numero} WLD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-wt-text-secondary">Total Números:</span>
              <span className="text-wt-text">{sorteo.configuracion.total_numeros}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-wt-text-secondary">Números Vendidos:</span>
              <span className="text-wt-text">{sorteo.numeros_vendidos.length}</span>
            </div>
          </div>
        </AnimatedScale>
        {sorteo.tipo === "TOKEN" && !ganador && (
          <AnimatedScale
            delay={0.2}
            className="card mb-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800"
          >
            <div className="flex items-start">
              <div className="mr-3 mt-1">
                <Check className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="font-medium text-amber-700 dark:text-amber-400 mb-1">Premio Acumulado</h3>
                <p className="text-sm text-amber-600 dark:text-amber-300">
                  El número ganador no fue vendido. El premio se acumulará para el próximo sorteo.
                </p>
              </div>
            </div>
          </AnimatedScale>
        )}
        <AnimatedSlideUp delay={0.3}>
          <Link href="/" className="wt-button wt-button-primary w-full block text-center">
            Volver a Inicio
          </Link>
        </AnimatedSlideUp>
      </div>
      <Navigation />
    </main>
  )
}