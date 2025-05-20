"use client"

import { useEffect, useState, Suspense, lazy } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Navigation from "@/components/navigation"
import { useWorldAppAuth } from "@/components/world-app-integration"
import { AnimatedStagger, AnimatedStaggerItem, AnimatedSlideUp } from "@/components/animated-components"
import { getSorteos } from "@/services/api"
import { useApiAvailability } from "@/hooks/useApi"
import type { Sorteo } from "@/types/sorteo"
import { AlertCircle } from "lucide-react"

const RaffleCard = lazy(() => import("@/components/raffle-card"))

const sampleRaffles: Sorteo[] = [
  {
    id: "1",
    nombre: "Sorteo de Prueba 1",
    descripcion: "Un sorteo increíble para probar la plataforma.",
    tipo: "MATERIAL",
    premio: { tipo: "MATERIAL", descripcion: "iPhone 14", valor: 999, moneda: "USD" },
    configuracion: { 
      precio_por_numero: 5, 
      total_numeros: 100, 
      fecha_fin: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), 
      estado: "ACTIVO", 
      imagen_url: "" 
    },
    numeros_vendidos: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100)),
    creado_por: "admin",
    fecha_creacion: new Date(),
    fecha_actualizacion: new Date(),
  },
  {
    id: "2",
    nombre: "Sorteo de Tokens",
    descripcion: "Gana tokens WLD para usar en la plataforma.",
    tipo: "TOKEN",
    premio: { tipo: "TOKEN", cantidad: 500, token: "WLD" },
    configuracion: { 
      precio_por_numero: 2, 
      total_numeros: 200, 
      fecha_fin: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), 
      estado: "ACTIVO", 
      imagen_url: "" 
    },
    numeros_vendidos: Array.from({ length: 50 }, () => Math.floor(Math.random() * 200)),
    premio_acumulado: 100,
    creado_por: "admin",
    fecha_creacion: new Date(),
    fecha_actualizacion: new Date(),
  },
]

export default function Home() {
  const { isWorldIDVerified, isDemoMode } = useWorldAppAuth() // Usar propiedades correctas
  const router = useRouter()
  const [activeRaffles, setActiveRaffles] = useState<Sorteo[]>([])
  const [isLoadingRaffles, setIsLoadingRaffles] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isApiAvailable, isChecking } = useApiAvailability()

  useEffect(() => {
    if (!isChecking && !isWorldIDVerified && !isDemoMode) {
      router.push("/login")
    }
  }, [isChecking, isWorldIDVerified, isDemoMode, router])

  useEffect(() => {
    const fetchRaffles = async () => {
      if (!isWorldIDVerified && !isDemoMode) return
      setIsLoadingRaffles(true)
      setError(null)
      try {
        if (isDemoMode || !isApiAvailable) {
          console.log("Usando datos de muestra para los sorteos")
          await new Promise((resolve) => setTimeout(resolve, 1000))
          setActiveRaffles(sampleRaffles)
        } else {
          console.log("Obteniendo datos reales de los sorteos")
          const response = await getSorteos()
          if (response.error) throw new Error(response.error)
          setActiveRaffles(response.data || [])
        }
      } catch (error: any) {
        console.error("Error al cargar sorteos:", error)
        setError(error.message || "No se pudieron cargar los sorteos")
        setActiveRaffles(sampleRaffles)
      } finally {
        setIsLoadingRaffles(false)
      }
    }
    if (!isChecking) fetchRaffles()
  }, [isWorldIDVerified, isDemoMode, isApiAvailable, isChecking])

  if (isChecking) {
    return <div>Cargando...</div>
  }

  return (
    <main>
      <Header />
      <div>
        {activeRaffles.map((raffle) => (
          <RaffleCard key={raffle.id} {...raffle} />
        ))}
      </div>
      <Navigation />
    </main>
  )
}