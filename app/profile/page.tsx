"use client"

import { useState, useEffect } from "react"
import { User, Ticket, Bell, LogOut, Settings, AlertCircle, Check, Trophy } from "lucide-react"
import Header from "@/components/header"
import Navigation from "@/components/navigation"
import { useWorldAppAuth } from "@/components/world-app-integration"
import { AnimatedScale, AnimatedSlideUp, AnimatedStagger, AnimatedStaggerItem } from "@/components/animated-components"
import { getNotificacionesUsuario } from "@/services/api"
import { useApiAvailability } from "@/hooks/useApi"
import type { NotificacionUsuario } from "@/types/sorteo"
import Link from "next/link"
import { motion } from "framer-motion"

export default function Profile() {
  const { username, logout, isWorldIDVerified, isDemoMode } = useWorldAppAuth()
  const [activeTab, setActiveTab] = useState<"participaciones" | "notificaciones">("participaciones")
  const [notificaciones, setNotificaciones] = useState<NotificacionUsuario[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isApiAvailable, isChecking } = useApiAvailability()

  useEffect(() => {
    const fetchNotificaciones = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Si la API no está disponible o estamos en modo demo, usar datos de muestra
        if (isDemoMode || !isApiAvailable) {
          await new Promise((resolve) => setTimeout(resolve, 1000)) // Simular carga

          // Datos de muestra para notificaciones
          const sampleNotificaciones: NotificacionUsuario[] = [
            {
              raffleId: "1",
              nombre: "iPhone 15 Pro Giveaway",
              estado: "ACTIVO",
              numerosComprados: [5, 12, 27],
              esGanador: false,
              fechaFin: new Date("2025-05-30"),
              premio: {
                tipo: "MATERIAL",
                descripcion: "iPhone 15 Pro",
                valor: 1000,
                moneda: "USD",
              },
            },
            {
              raffleId: "3",
              nombre: "PlayStation 5 Bundle",
              estado: "FINALIZADO",
              numerosComprados: [42, 77],
              esGanador: true,
              fechaFin: new Date("2023-07-01"),
              premio: {
                tipo: "MATERIAL",
                descripcion: "PlayStation 5 Bundle",
                valor: 600,
                moneda: "USD",
              },
            },
          ]

          setNotificaciones(sampleNotificaciones)
        } else {
          // Obtener datos reales del backend
          const userId = "demo_user" // En una implementación real, obtener el ID del usuario autenticado
          const response = await getNotificacionesUsuario(userId)

          if (response.error) {
            throw new Error(response.error)
          }

          setNotificaciones(response.data || [])
        }
      } catch (error: any) {
        console.error("Error al cargar notificaciones:", error)
        setError(error.message || "No se pudieron cargar las notificaciones")

        // Usar datos de muestra como fallback
        setNotificaciones([
          {
            raffleId: "1",
            nombre: "Sorteo de Ejemplo",
            estado: "ACTIVO",
            numerosComprados: [5, 12, 27],
            esGanador: false,
            fechaFin: new Date(),
            premio: {
              tipo: "MATERIAL",
              descripcion: "Premio de Ejemplo",
              valor: 100,
              moneda: "USD",
            },
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotificaciones()
  }, [isDemoMode, isApiAvailable, isChecking])

  return (
    <main className="min-h-screen pb-24 bg-wt-background">
      <Header />

      <div className="p-4 max-w-md mx-auto">
        <AnimatedScale className="card mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-wt-primary/10 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-wt-primary" />
            </div>
            <div className="flex-1">
              <h1 className="font-bold text-xl text-wt-text">{username || "Usuario"}</h1>
              <div className="flex items-center mt-1">
                {isWorldIDVerified && (
                  <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full flex items-center">
                    <Check className="w-3 h-3 mr-1" />
                    Verificado con World ID
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex mt-6 gap-2">
            <button
              className="flex-1 py-2 rounded-lg flex justify-center items-center text-sm gap-1"
              onClick={() => alert("Configuración no disponible en esta versión")}
            >
              <Settings className="w-4 h-4" />
              <span>Configuración</span>
            </button>
            <button
              className="flex-1 py-2 rounded-lg flex justify-center items-center text-sm gap-1 text-red-500"
              onClick={logout}
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </AnimatedScale>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4 flex items-center text-sm text-red-800 dark:text-red-300">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="flex mb-4 bg-wt-card rounded-lg p-1 border border-wt-card-border">
          <button
            className={`flex-1 py-2 rounded-lg flex justify-center items-center text-sm gap-1 ${
              activeTab === "participaciones" ? "bg-wt-primary text-white" : "text-wt-text-secondary"
            }`}
            onClick={() => setActiveTab("participaciones")}
          >
            <Ticket className="w-4 h-4" />
            <span>Mis Participaciones</span>
          </button>
          <button
            className={`flex-1 py-2 rounded-lg flex justify-center items-center text-sm gap-1 ${
              activeTab === "notificaciones" ? "bg-wt-primary text-white" : "text-wt-text-secondary"
            }`}
            onClick={() => setActiveTab("notificaciones")}
          >
            <Bell className="w-4 h-4" />
            <span>Notificaciones</span>
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <motion.div
              className="w-10 h-10 border-t-2 border-wt-primary rounded-full animate-spin"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            ></motion.div>
          </div>
        ) : activeTab === "participaciones" ? (
          <AnimatedStagger className="space-y-4">
            {notificaciones.length > 0 ? (
              notificaciones.map((notificacion) => (
                <AnimatedStaggerItem key={`${notificacion.raffleId}-${notificacion.numerosComprados.join("-")}`}>
                  <Link href={`/raffle/${notificacion.raffleId}`} className="block">
                    <div className="card hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-wt-text">{notificacion.nombre}</h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            notificacion.estado === "ACTIVO"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                              : notificacion.estado === "FINALIZADO"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                          }`}
                        >
                          {notificacion.estado === "ACTIVO"
                            ? "Activo"
                            : notificacion.estado === "FINALIZADO"
                              ? "Finalizado"
                              : notificacion.estado}
                        </span>
                      </div>

                      <div className="text-sm text-wt-text-secondary mb-2">
                        Números:{" "}
                        <span className="font-medium text-wt-text">
                          {notificacion.numerosComprados.map((n) => n.toString().padStart(2, "0")).join(", ")}
                        </span>
                      </div>

                      {notificacion.esGanador && (
                        <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-sm p-2 rounded-lg mb-2 flex items-center">
                          <Trophy className="w-4 h-4 mr-1" />
                          ¡Ganador! -{" "}
                          {notificacion.premio.tipo === "MATERIAL"
                            ? notificacion.premio.descripcion
                            : `${notificacion.premio.tipo === "TOKEN" ? `${notificacion.premio.cantidad} ${notificacion.premio.token}` : ""}`}
                        </div>
                      )}

                      <div className="text-xs text-wt-text-secondary">
                        Fecha sorteo: {new Date(notificacion.fechaFin).toLocaleDateString()}
                      </div>
                    </div>
                  </Link>
                </AnimatedStaggerItem>
              ))
            ) : (
              <AnimatedSlideUp className="card p-8 text-center">
                <p className="text-wt-text-secondary">No has participado en ningún sorteo aún.</p>
                <Link href="/" className="text-wt-primary text-sm mt-2 inline-block hover:underline">
                  Ver sorteos disponibles
                </Link>
              </AnimatedSlideUp>
            )}
          </AnimatedStagger>
        ) : (
          <AnimatedStagger className="space-y-4">
            {notificaciones.length > 0 ? (
              notificaciones.map((notificacion) => (
                <AnimatedStaggerItem key={`notif-${notificacion.raffleId}`}>
                  <div className="card">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          notificacion.esGanador
                            ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                            : notificacion.estado === "FINALIZADO"
                              ? "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                              : "bg-wt-primary/10 text-wt-primary"
                        }`}
                      >
                        {notificacion.esGanador ? (
                          <Trophy className="w-4 h-4" />
                        ) : notificacion.estado === "FINALIZADO" ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Bell className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-wt-text text-sm">{notificacion.nombre}</h3>
                        <p className="text-wt-text-secondary text-xs mt-1">
                          {notificacion.esGanador
                            ? `¡Felicidades! Has ganado ${
                                notificacion.premio.tipo === "MATERIAL"
                                  ? notificacion.premio.descripcion
                                  : `${notificacion.premio.tipo === "TOKEN" ? `${notificacion.premio.cantidad} ${notificacion.premio.token}` : ""}`
                              }`
                            : notificacion.estado === "FINALIZADO"
                              ? "El sorteo ha finalizado. Revisa los resultados."
                              : `Participando con los números: ${notificacion.numerosComprados.map((n) => n.toString().padStart(2, "0")).join(", ")}`}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-wt-text-secondary">
                            {new Date(notificacion.fechaFin).toLocaleDateString()}
                          </span>
                          <Link
                            href={`/raffle/${notificacion.raffleId}`}
                            className="text-xs text-wt-primary hover:underline"
                          >
                            Ver detalles
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedStaggerItem>
              ))
            ) : (
              <AnimatedSlideUp className="card p-8 text-center">
                <p className="text-wt-text-secondary">No tienes notificaciones.</p>
              </AnimatedSlideUp>
            )}
          </AnimatedStagger>
        )}
      </div>

      <Navigation />
    </main>
  )
}
