"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Filter, AlertCircle, Trophy, Clock, CheckCircle, XCircle, PauseCircle } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/contexts/i18n-context"
import { getSorteos } from "@/services/api"
import { useApiAvailability } from "@/hooks/useApi"
import type { Sorteo, EstadoSorteo, TipoSorteo } from "@/types/sorteo"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function AdminRaffles() {
  const { t } = useI18n()
  const [sorteos, setSorteos] = useState<Sorteo[]>([])
  const [filteredSorteos, setFilteredSorteos] = useState<Sorteo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isApiAvailable, isChecking } = useApiAvailability()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<EstadoSorteo | "TODOS">("TODOS")

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        if (!isApiAvailable || isChecking) {
          const sampleRaffles: Sorteo[] = [
            {
              id: "1",
              nombre: "iPhone 15 Pro Giveaway",
              descripcion: "Win the latest iPhone 15 Pro with 256GB storage",
              tipo: "MATERIAL" as TipoSorteo,
              premio: {
                tipo: "MATERIAL",
                descripcion: "iPhone 15 Pro",
                valor: 1000,
                moneda: "USD",
              },
              configuracion: {
                precio_por_numero: 5,
                total_numeros: 1000,
                fecha_fin: new Date("2025-05-30"),
                estado: "ACTIVO" as EstadoSorteo,
              },
              numeros_vendidos: Array.from({ length: 450 }, (_, i) => i + 1),
              creado_por: "admin",
              fecha_creacion: new Date("2023-01-01"),
              fecha_actualizacion: new Date("2023-01-01"),
            },
            {
              id: "2",
              nombre: "1000 WLD Token Prize",
              descripcion: "Win 1000 WLD tokens directly to your wallet",
              tipo: "TOKEN" as TipoSorteo,
              premio: {
                tipo: "TOKEN",
                cantidad: 1000,
                token: "WLD",
              },
              configuracion: {
                precio_por_numero: 2,
                total_numeros: 2000,
                fecha_fin: new Date("2025-06-15"),
                estado: "ACTIVO" as EstadoSorteo,
              },
              numeros_vendidos: Array.from({ length: 1200 }, (_, i) => i + 1),
              premio_acumulado: 500,
              creado_por: "admin",
              fecha_creacion: new Date("2023-01-01"),
              fecha_actualizacion: new Date("2023-01-01"),
            },
            // ... otros sorteos con tipos correctos
          ]
          setSorteos(sampleRaffles)
          setFilteredSorteos(sampleRaffles)
        } else {
          const response = await getSorteos()
          if (response.error) throw new Error(response.error)
          setSorteos(response.data || [])
          setFilteredSorteos(response.data || [])
        }
      } catch (error: any) {
        console.error("Error al cargar datos:", error)
        setError(error.message || "Error al cargar datos")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [isApiAvailable, isChecking])

  // Resto del código sin cambios (filtrado, íconos, renderizado)
  // ... (omitido por brevedad, pero permanece igual al original)
}