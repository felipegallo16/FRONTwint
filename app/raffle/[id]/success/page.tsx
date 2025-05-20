"use client"

import { useEffect, useState } from "react"
import { Check } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import Header from "@/components/header"
import Navigation from "@/components/navigation"
import { useWorldAppAuth } from "@/components/world-app-integration"
import { AnimatedScale } from "@/components/animated-components"
import { getSorteoById } from "@/services/api"
import { useApiAvailability } from "@/hooks/useApi"
import type { Sorteo } from "@/types/sorteo"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function PurchaseSuccess({ params }: { params: { id: string } }) {
  const { isDemoMode } = useWorldAppAuth()
  const { isApiAvailable } = useApiAvailability()
  const searchParams = useSearchParams()
  const [sorteo, setSorteo] = useState<Sorteo | null>(null)
  const [purchaseDetails, setPurchaseDetails] = useState({
    selectedNumbers: [] as string[],
  })

  // Obtener los números seleccionados de la URL
  useEffect(() => {
    const numbersParam = searchParams.get("numbers")
    if (numbersParam) {
      const selectedNumbers = numbersParam.split(",")
      setPurchaseDetails((prev) => ({
        ...prev,
        selectedNumbers,
      }))
    }
  }, [searchParams])

  // Cargar detalles del sorteo
  useEffect(() => {
    const fetchRaffleDetails = async () => {
      try {
        // Si la API no está disponible o estamos en modo demo, usar datos de muestra
        if (isDemoMode || !isApiAvailable) {
          // Datos de muestra para el modo demo
          const sampleRaffle = {
            id: params.id,
            nombre: "Sorteo de Ejemplo",
            descripcion: "Este es un sorteo de ejemplo para mostrar cuando hay errores de carga.",
            tipo: "MATERIAL" as const,
            premio: {
              tipo: "MATERIAL" as const,
              descripcion: "Premio de Ejemplo",
              valor: 100,
              moneda: "USD",
            },
            configuracion: {
              precio_por_numero: 3,
              total_numeros: 100,
              fecha_fin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días en el futuro
              estado: "ACTIVO" as const,
            },
            numeros_vendidos: [],
            creado_por: "sistema",
            fecha_creacion: new Date(),
            fecha_actualizacion: new Date(),
          }

          setSorteo(sampleRaffle)
        } else {
          // Obtener datos reales del backend
          const response = await getSorteoById(params.id)
          if (response.error) {
            throw new Error(response.error)
          }

          if (!response.data) {
            throw new Error("No se encontraron datos del sorteo")
          }

          setSorteo(response.data)
        }
      } catch (error) {
        console.error("Error al cargar detalles del sorteo:", error)

        // Usar datos de muestra como fallback
        const sampleRaffle = {
          id: params.id,
          nombre: "Sorteo de Ejemplo",
          descripcion: "Este es un sorteo de ejemplo para mostrar cuando hay errores de carga.",
          tipo: "MATERIAL" as const,
          premio: {
            tipo: "MATERIAL" as const,
            descripcion: "Premio de Ejemplo",
            valor: 100,
            moneda: "USD",
          },
          configuracion: {
            precio_por_numero: 3,
            total_numeros: 100,
            fecha_fin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días en el futuro
            estado: "ACTIVO" as const,
          },
          numeros_vendidos: [],
          creado_por: "sistema",
          fecha_creacion: new Date(),
          fecha_actualizacion: new Date(),
        }

        setSorteo(sampleRaffle)
      }
    }
    fetchRaffleDetails()
  }, [params.id, isDemoMode, isApiAvailable])

  // Formatear fecha
  const fechaFormateada = sorteo
    ? format(new Date(sorteo.configuracion.fecha_fin), "dd/MM/yyyy", { locale: es })
    : "Cargando..."

  return (
    <main className="min-h-screen pb-24 bg-wt-background">
      <Header />

      <div className="p-4 max-w-md mx-auto flex flex-col items-center">
        <AnimatedScale>
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6 mt-8 border border-green-200 dark:border-green-800/30">
            <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
        </AnimatedScale>

        <h1 className="font-bold text-xl mb-2 text-center text-wt-text">¡Compra Exitosa!</h1>
        <p className="text-wt-text-secondary text-center mb-8">Tu participación ha sido confirmada</p>

        <AnimatedScale delay={0.1} className="card w-full mb-8">
          <h2 className="font-bold mb-5 text-wt-text">{sorteo?.nombre || "Cargando..."}</h2>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-wt-text-secondary">Números Comprados:</span>
              <span className="font-bold text-wt-text">{purchaseDetails.selectedNumbers.join(", ")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-wt-text-secondary">Fecha del Sorteo:</span>
              <span className="text-wt-text">{fechaFormateada}</span>
            </div>
          </div>
        </AnimatedScale>

        <div className="space-y-3 w-full">
          <Link href="/" className="wt-button wt-button-primary w-full block text-center">
            Volver a Inicio
          </Link>
          <Link href="/profile" className="wt-button wt-button-outline w-full block text-center">
            Ver Mis Participaciones
          </Link>
        </div>
      </div>

      <Navigation />
    </main>
  )
}
