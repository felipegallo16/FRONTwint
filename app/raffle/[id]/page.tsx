"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Shuffle, Trophy, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import Header from "@/components/header"
import Navigation from "@/components/navigation"
import WorldIDVerification from "@/components/world-id-verification"
import { useWorldAppAuth } from "@/components/world-app-integration"
import {
  AnimatedSlideUp,
  AnimatedScale,
  AnimatedStagger,
  AnimatedStaggerItem,
  AnimatedButton,
} from "@/components/animated-components"
import { motion } from "framer-motion"
import { getSorteoById, getEstadoSorteo, getAvailableNumbers } from "@/services/api"
import { useApiAvailability } from "@/hooks/useApi"
import type { Sorteo, EstadoDetallado, TipoSorteo } from "@/types/sorteo"
import { formatDistanceToNow, format } from "date-fns"
import { es } from "date-fns/locale"
import { MiniKit } from "@worldcoin/minikit-js"

// Función para generar un nonce aleatorio
const generateNonce = () => Math.random().toString(36).substring(2, 15)

// Función para formatear números
const formatNumber = (num: number): string => (num < 10 ? `0${num}` : num.toString())

export default function RaffleDetail({ params }: { params: { id: string } }) {
  const [sorteo, setSorteo] = useState<Sorteo | null>(null)
  const [estadoDetallado, setEstadoDetallado] = useState<EstadoDetallado | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([])
  const [availableNumbers, setAvailableNumbers] = useState<string[]>([])
  const [unavailableNumbers, setUnavailableNumbers] = useState<string[]>([])
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isWorldIDVerified, setWorldIDVerificationStatus, isDemoMode } = useWorldAppAuth()
  const { isApiAvailable, isChecking } = useApiAvailability()

  useEffect(() => {
    const fetchRaffleData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        if (isDemoMode || !isApiAvailable) {
          // Datos de ejemplo para modo demo
          const sampleRaffle: Sorteo = {
            id: params.id,
            nombre: "Sorteo de Ejemplo",
            descripcion: "Un sorteo de ejemplo para modo demo.",
            tipo: "MATERIAL" as TipoSorteo,
            premio: { tipo: "MATERIAL", descripcion: "Producto Ejemplo", valor: 100, moneda: "USD" },
            configuracion: {
              precio_por_numero: 5,
              total_numeros: 100,
              fecha_fin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              estado: "ACTIVO",
              imagen_url: "/images/placeholder.jpg",
            },
            numeros_vendidos: Array.from({ length: 30 }, (_, i) => i + 1),
            creado_por: "sistema",
            fecha_creacion: new Date(),
            fecha_actualizacion: new Date(),
          }
          setSorteo(sampleRaffle)

          const estadoMuestra: EstadoDetallado = {
            id: sampleRaffle.id,
            nombre: sampleRaffle.nombre,
            estado: sampleRaffle.configuracion.estado,
            fechaFin: sampleRaffle.configuracion.fecha_fin,
            numerosVendidos: sampleRaffle.numeros_vendidos.length,
            totalNumeros: sampleRaffle.configuracion.total_numeros,
            porcentajeVendido: Math.round(
              (sampleRaffle.numeros_vendidos.length / sampleRaffle.configuracion.total_numeros) * 100
            ),
            premio: sampleRaffle.premio,
          }
          setEstadoDetallado(estadoMuestra)

          const mockUnavailable = sampleRaffle.numeros_vendidos.map(num => formatNumber(num))
          const mockAvailable = Array.from({ length: sampleRaffle.configuracion.total_numeros }, (_, i) =>
            formatNumber(i + 1)
          ).filter(num => !mockUnavailable.includes(num))
          setAvailableNumbers(mockAvailable)
          setUnavailableNumbers(mockUnavailable)
        } else {
          const [sorteoRes, estadoRes, numbersRes] = await Promise.all([
            getSorteoById(params.id),
            getEstadoSorteo(params.id),
            getAvailableNumbers(params.id),
          ])

          if (sorteoRes.error) throw new Error(sorteoRes.error)
          if (estadoRes.error) throw new Error(estadoRes.error)
          if (numbersRes.error) throw new Error(numbersRes.error)

          setSorteo(sorteoRes.data || null)
          setEstadoDetallado(estadoRes.data || null)
          setAvailableNumbers(numbersRes.data?.available || [])
          setUnavailableNumbers(numbersRes.data?.unavailable || [])
        }
      } catch (err) {
        setError((err as Error).message || "Error al cargar los datos")
        setSorteo(null) // En caso de error, seteamos null y manejamos en el render
        setEstadoDetallado(null)
      } finally {
        setIsLoading(false)
        setIsWalletConnected(true) // Simulamos conexión para este ejemplo
      }
    }

    if (!isChecking) fetchRaffleData()
  }, [params.id, isDemoMode, isApiAvailable, isChecking])

  const handleRandomNumber = () => {
    const remainingNumbers = availableNumbers.filter(num => !selectedNumbers.includes(num))
    if (remainingNumbers.length === 0) return

    const newSelected = []
    const numbersToSelect = Math.min(quantity, remainingNumbers.length)
    for (let i = 0; i < numbersToSelect; i++) {
      const randomIndex = Math.floor(Math.random() * remainingNumbers.length)
      newSelected.push(remainingNumbers[randomIndex])
      remainingNumbers.splice(randomIndex, 1)
    }
    setSelectedNumbers(newSelected)
  }

  const handleConnectWallet = async () => {
    try {
      const response = await MiniKit.commandsAsync.walletAuth({ nonce: generateNonce() })
      if (response.finalPayload && "address" in response.finalPayload) {
        setIsWalletConnected(true)
      } else {
        setError("Fallo al conectar la wallet")
      }
    } catch (err) {
      setError("Error al conectar la wallet")
    }
  }

  const handleVerificationComplete = (success: boolean) => {
    setWorldIDVerificationStatus(success)
  }

  // Mostrar loader mientras se cargan los datos
  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen bg-wt-background">
        <Header />
        <div className="p-4 max-w-md mx-auto">
          <div className="card animate-pulse">
            <div className="h-6 bg-wt-gray/20 rounded w-3/4 mb-4"></div>
            <div className="h-40 bg-wt-gray/20 rounded mb-4"></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="h-20 bg-wt-gray/20 rounded"></div>
              <div className="h-20 bg-wt-gray/20 rounded"></div>
            </div>
          </div>
        </div>
        <Navigation />
      </div>
    )
  }

  // Mostrar mensaje si no hay datos
  if (!sorteo || !estadoDetallado) {
    return (
      <div className="min-h-screen bg-wt-background">
        <Header />
        <div className="p-4 max-w-md mx-auto">
          <AnimatedScale className="card p-8 text-center">
            <p className="text-wt-text-secondary">
              {error || "Sorteo no encontrado."}
            </p>
          </AnimatedScale>
        </div>
        <Navigation />
      </div>
    )
  }

  const totalCost = quantity * (sorteo.configuracion.precio_por_numero || 0)
  const tiempoRestante = formatDistanceToNow(new Date(sorteo.configuracion.fecha_fin), { addSuffix: true, locale: es })
  const fechaFormateada = format(new Date(sorteo.configuracion.fecha_fin), "dd/MM/yyyy", { locale: es })
  const esSorteoActivo = sorteo.configuracion.estado === "ACTIVO"

  // Función para mostrar el texto del premio según su tipo
  const getPremioTexto = () => {
    if (sorteo.premio.tipo === "TOKEN") {
      return `${sorteo.premio.cantidad} ${sorteo.premio.token}`
    } else if (sorteo.premio.tipo === "MATERIAL") {
      return sorteo.premio.descripcion
    }
    return "Premio no especificado"
  }

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
        <AnimatedScale className="card mb-6">
          <div className="flex items-center gap-4 mb-5">
            <motion.div
              className="w-14 h-14 bg-[var(--wt-primary-10)] rounded-full flex items-center justify-center flex-shrink-0"
              whileHover={{ scale: 1.1 }}
            >
              <Trophy className="w-7 h-7 text-wt-primary" />
            </motion.div>
            <div>
              <h1 className="font-bold text-xl text-wt-text">{sorteo.nombre}</h1>
              <div
                className={`text-xs px-2 py-0.5 rounded-full inline-flex items-center mt-1
                  ${sorteo.configuracion.estado === "ACTIVO" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
              >
                {sorteo.configuracion.estado}
              </div>
            </div>
          </div>
          <p className="text-wt-text-secondary mb-6">{sorteo.descripcion}</p>
          {sorteo.configuracion.imagen_url && (
            <div className="mb-6 rounded-lg overflow-hidden">
              <Image
                src={sorteo.configuracion.imagen_url}
                alt={sorteo.nombre}
                width={400}
                height={200}
                className="w-full h-auto object-cover"
              />
            </div>
          )}
          <AnimatedStagger className="grid grid-cols-2 gap-3 mb-4">
            <AnimatedStaggerItem className="bg-wt-background p-4 rounded-lg">
              <p className="text-wt-text-secondary text-xs mb-1">Premio</p>
              <p className="font-bold text-wt-text">{getPremioTexto()}</p>
            </AnimatedStaggerItem>
            <AnimatedStaggerItem className="bg-wt-background p-4 rounded-lg">
              <p className="text-wt-text-secondary text-xs mb-1">Precio por Número</p>
              <p className="font-bold text-wt-text">{sorteo.configuracion.precio_por_numero} WLD</p>
            </AnimatedStaggerItem>
            <AnimatedStaggerItem className="bg-wt-background p-4 rounded-lg">
              <p className="text-wt-text-secondary text-xs mb-1">Fecha Fin</p>
              <p className="font-bold text-wt-text">{fechaFormateada}</p>
              <p className="text-xs text-wt-text-secondary mt-1">{tiempoRestante}</p>
            </AnimatedStaggerItem>
            <AnimatedStaggerItem className="bg-wt-background p-4 rounded-lg">
              <p className="text-wt-text-secondary text-xs mb-1">Números Vendidos</p>
              <p className="font-bold text-wt-text">
                {estadoDetallado.numerosVendidos}/{estadoDetallado.totalNumeros}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div
                  className="bg-wt-primary h-1.5 rounded-full"
                  style={{ width: `${estadoDetallado.porcentajeVendido}%` }}
                ></div>
              </div>
            </AnimatedStaggerItem>
          </AnimatedStagger>
        </AnimatedScale>
        {esSorteoActivo && (
          <AnimatedScale delay={0.1} className="card mb-6">
            <h2 className="font-bold text-lg mb-5 text-wt-text">Elige tu Número</h2>
            <div className="mb-5">
              <label className="block text-wt-text-secondary text-sm mb-2">Cantidad</label>
              <div className="flex items-center">
                <motion.button
                  className="w-12 h-12 bg-wt-background rounded-l-lg flex items-center justify-center"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  whileTap={{ scale: 0.95 }}
                >
                  -
                </motion.button>
                <motion.div
                  className="h-12 w-16 bg-wt-card flex items-center justify-center border-t border-b border-wt-card-border"
                  animate={{ scale: [1, 1.05, 1] }}
                  key={quantity}
                >
                  {quantity}
                </motion.div>
                <motion.button
                  className="w-12 h-12 bg-wt-background rounded-r-lg flex items-center justify-center"
                  onClick={() => setQuantity(quantity + 1)}
                  whileTap={{ scale: 0.95 }}
                >
                  +
                </motion.button>
              </div>
            </div>
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-wt-text-secondary text-sm">Elige Número</label>
                <motion.button
                  className="p-2 bg-wt-background rounded-lg flex items-center justify-center text-xs"
                  onClick={handleRandomNumber}
                  whileTap={{ rotate: 180 }}
                >
                  <Shuffle className="w-4 h-4 text-wt-text-secondary mr-1" />
                  Aleatorio
                </motion.button>
              </div>
              <div className="bg-wt-background p-3 rounded-lg">
                <div className="flex justify-center items-center min-h-12 bg-wt-card rounded-lg border border-wt-card-border mb-3 p-2 flex-wrap">
                  {selectedNumbers.length > 0 ? (
                    selectedNumbers.map(num => (
                      <motion.div
                        key={num}
                        className="px-3 py-1 bg-wt-primary text-white rounded-lg flex items-center m-1"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                      >
                        <span className="font-bold">{num}</span>
                        <button
                          className="ml-2 text-white/80 hover:text-white"
                          onClick={() => setSelectedNumbers(selectedNumbers.filter(n => n !== num))}
                        >
                          ×
                        </button>
                      </motion.div>
                    ))
                  ) : (
                    <span className="text-wt-text-secondary">No hay números seleccionados</span>
                  )}
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: Math.min(40, sorteo.configuracion.total_numeros) }, (_, i) => {
                    const number = formatNumber(i + 1)
                    const isAvailable = !unavailableNumbers.includes(number)
                    const isSelected = selectedNumbers.includes(number)
                    return (
                      <motion.button
                        key={number}
                        className={`p-2 rounded-lg flex items-center justify-center ${
                          isSelected
                            ? "bg-wt-primary text-white"
                            : isAvailable
                            ? "bg-wt-card"
                            : "bg-wt-card opacity-50 cursor-not-allowed"
                        }`}
                        onClick={() => {
                          if (!isAvailable) return
                          setSelectedNumbers(
                            isSelected
                              ? selectedNumbers.filter(n => n !== number)
                              : selectedNumbers.length < quantity
                              ? [...selectedNumbers, number]
                              : selectedNumbers
                          )
                        }}
                        whileHover={isAvailable ? { scale: 1.05 } : {}}
                        disabled={!isAvailable}
                      >
                        {number}
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            </div>
            <motion.div className="bg-wt-background p-4 rounded-lg mb-5" whileHover={{ scale: 1.02 }}>
              <div className="flex justify-between mb-2">
                <span className="text-wt-text-secondary">Números seleccionados:</span>
                <span className="text-wt-text">{selectedNumbers.join(", ") || "Ninguno"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-wt-text-secondary">Costo Total:</span>
                <motion.span className="font-bold text-wt-text" key={totalCost} animate={{ scale: [1, 1.1, 1] }}>
                  {totalCost} WLD
                </motion.span>
              </div>
            </motion.div>
          </AnimatedScale>
        )}
        <AnimatedSlideUp delay={0.2} className="space-y-4">
          {esSorteoActivo ? (
            !isWalletConnected && !isDemoMode ? (
              <AnimatedButton className="wt-button wt-button-primary w-full" onClick={handleConnectWallet}>
                Conectar Wallet
              </AnimatedButton>
            ) : !isWorldIDVerified && !isDemoMode ? (
              <AnimatedScale className="card p-4">
                <h3 className="text-sm font-medium text-wt-text mb-3">Verificación Requerida</h3>
                <WorldIDVerification onVerificationComplete={handleVerificationComplete} buttonText="Verificar con World ID" />
              </AnimatedScale>
            ) : (
              <Link
                href={selectedNumbers.length === quantity ? `/raffle/${params.id}/confirm?numbers=${selectedNumbers.join(",")}` : "#"}
                onClick={e => {
                  if (selectedNumbers.length < quantity) e.preventDefault()
                }}
              >
                <AnimatedButton
                  className={`wt-button w-full ${selectedNumbers.length === quantity ? "wt-button-accent" : "wt-button-outline"}`}
                >
                  {selectedNumbers.length === quantity ? "Comprar Ticket" : "Selecciona más números"}
                </AnimatedButton>
              </Link>
            )
          ) : (
            <div className="card p-4 text-center">
              <p className="text-wt-text-secondary">Este sorteo no está activo.</p>
            </div>
          )}
        </AnimatedSlideUp>
      </div>
      <Navigation />
    </main>
  )
}