"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Plus, Search, Filter, AlertCircle, Trophy, Clock, CheckCircle, XCircle, PauseCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/contexts/i18n-context"
import type { Sorteo, EstadoSorteo, PremioToken, PremioMaterial } from "@/types/sorteo"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { getRaffles } from "@/lib/api"

export default function AdminRaffles() {
  const { t } = useI18n()
  const router = useRouter()
  const [raffles, setRaffles] = useState<Sorteo[]>([])
  const [filteredRaffles, setFilteredRaffles] = useState<Sorteo[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<EstadoSorteo | "TODOS">("TODOS")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isApiAvailable, setIsApiAvailable] = useState(true)
  const [isChecking, setIsChecking] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        console.log("Checking API status...")
        const response = await fetch("https://wintrust-backend.onrender.com/sorteos", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        })
        console.log("API status response:", response.status, response.statusText)
        
        // Consideramos que la API está disponible si responde, incluso con error 500
        // porque significa que el servidor está funcionando
        setIsApiAvailable(response.status !== 404)
        
        if (!response.ok) {
          console.error("API responded with error:", response.status, response.statusText)
          const errorText = await response.text()
          console.error("Error details:", errorText)
        }
      } catch (error) {
        console.error("Error checking API status:", error)
        setIsApiAvailable(false)
        setIsDemoMode(true)
      } finally {
        setIsChecking(false)
      }
    }

    checkApiStatus()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (!isApiAvailable || isDemoMode) {
        // Datos de ejemplo para modo demo
        const demoRaffles: Sorteo[] = [
          {
            id: "1",
            nombre: "Sorteo Demo 1",
            descripcion: "Este es un sorteo de demostración",
            tipo: "TOKEN",
            premio: {
              tipo: "TOKEN",
              token: "WLD",
              cantidad: 100
            },
            configuracion: {
              estado: "ACTIVO",
              fecha_inicio: new Date(),
              fecha_fin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              total_numeros: 100,
              precio_por_numero: 1,
              imagen_url: ""
            },
            numeros_vendidos: [],
            creado_por: "admin",
            fecha_creacion: new Date(),
            fecha_actualizacion: new Date()
          },
          {
            id: "2",
            nombre: "Sorteo Demo 2",
            descripcion: "Sorteo de material de ejemplo",
            tipo: "MATERIAL",
            premio: {
              tipo: "MATERIAL",
              descripcion: "iPhone 15 Pro",
              valor: 999,
              moneda: "USD"
            },
            configuracion: {
              estado: "ACTIVO",
              fecha_inicio: new Date(),
              fecha_fin: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
              total_numeros: 50,
              precio_por_numero: 2,
              imagen_url: ""
            },
            numeros_vendidos: [],
            creado_por: "admin",
            fecha_creacion: new Date(),
            fecha_actualizacion: new Date()
          }
        ]
        setRaffles(demoRaffles)
        setFilteredRaffles(demoRaffles)
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const data = await getRaffles()
        setRaffles(data)
        setFilteredRaffles(data)
      } catch (err) {
        console.error("Error fetching raffles:", err)
        setError("No se pudieron cargar los sorteos. Mostrando datos de demostración.")
        setIsDemoMode(true)
        // Cargar datos de demo en caso de error
        const demoRaffles: Sorteo[] = [
          {
            id: "1",
            nombre: "Sorteo Demo 1",
            descripcion: "Este es un sorteo de demostración",
            tipo: "TOKEN",
            premio: {
              tipo: "TOKEN",
              token: "WLD",
              cantidad: 100
            },
            configuracion: {
              estado: "ACTIVO",
              fecha_inicio: new Date(),
              fecha_fin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              total_numeros: 100,
              precio_por_numero: 1,
              imagen_url: ""
            },
            numeros_vendidos: [],
            creado_por: "admin",
            fecha_creacion: new Date(),
            fecha_actualizacion: new Date()
          }
        ]
        setRaffles(demoRaffles)
        setFilteredRaffles(demoRaffles)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [isApiAvailable, isChecking])

  useEffect(() => {
    const filtered = raffles.filter((raffle) => {
      const matchesSearch = raffle.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        raffle.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = selectedStatus === "TODOS" || raffle.configuracion.estado === selectedStatus
      return matchesSearch && matchesStatus
    })
    setFilteredRaffles(filtered)
  }, [searchTerm, selectedStatus, raffles])

  const getStatusIcon = (estado: EstadoSorteo) => {
    switch (estado) {
      case "ACTIVO":
        return <Trophy className="w-5 h-5 text-green-500" />
      case "PAUSADO":
        return <PauseCircle className="w-5 h-5 text-yellow-500" />
      case "FINALIZADO":
        return <CheckCircle className="w-5 h-5 text-blue-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusText = (estado: EstadoSorteo) => {
    switch (estado) {
      case "ACTIVO":
        return "Activo"
      case "PAUSADO":
        return "Pausado"
      case "FINALIZADO":
        return "Finalizado"
      default:
        return estado
    }
  }

  const getPremioText = (raffle: Sorteo) => {
    if (raffle.tipo === "TOKEN") {
      const premio = raffle.premio as PremioToken
      return `${premio.cantidad} ${premio.token}`
    } else {
      const premio = raffle.premio as PremioMaterial
      return `${premio.valor} ${premio.moneda}`
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-wt-text">Cargando sorteos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-wt-text">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-wt-text">Sorteos</h1>
        <Link
          href="/admin/raffles/create"
          className="wt-button wt-button-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Crear Sorteo
        </Link>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-wt-text-secondary" />
            <input
              type="text"
              placeholder="Buscar sorteos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
        </div>
        <div className="w-48">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as EstadoSorteo | "TODOS")}
            className="input"
          >
            <option value="TODOS">Todos los estados</option>
            <option value="ACTIVO">Activos</option>
            <option value="PAUSADO">Pausados</option>
            <option value="FINALIZADO">Finalizados</option>
          </select>
        </div>
      </div>

      {filteredRaffles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-wt-text-secondary">No se encontraron sorteos</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRaffles.map((raffle) => (
            <motion.div
              key={raffle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-wt-surface rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-wt-text">{raffle.nombre}</h3>
                <div className="flex items-center gap-2">
                  {getStatusIcon(raffle.configuracion.estado)}
                  <span className="text-sm text-wt-text-secondary">
                    {getStatusText(raffle.configuracion.estado)}
                  </span>
                </div>
              </div>
              <p className="text-wt-text-secondary mb-4 line-clamp-2">{raffle.descripcion}</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-wt-text-secondary">
                  <Trophy className="w-4 h-4" />
                  <span>Premio: {getPremioText(raffle)}</span>
                </div>
                <div className="flex items-center gap-2 text-wt-text-secondary">
                  <Clock className="w-4 h-4" />
                  <span>
                    Fin: {raffle.configuracion.fecha_fin 
                      ? format(new Date(raffle.configuracion.fecha_fin), "PPP", { locale: es })
                      : "Sin fecha definida"}
                  </span>
                </div>
              </div>
              <div className="flex justify-end">
                <Link
                  href={`/admin/raffles/${raffle.id}`}
                  className="wt-button wt-button-secondary"
                >
                  Ver Detalles
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}