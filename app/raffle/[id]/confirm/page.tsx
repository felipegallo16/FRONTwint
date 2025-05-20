"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import Header from "@/components/header"
import Navigation from "@/components/navigation"
import { useWorldAppAuth } from "@/components/world-app-integration"
import { getSorteoById } from "@/services/api"
import { useApiAvailability } from "@/hooks/useApi"
import type { Sorteo } from "@/types/sorteo"
import { AnimatedScale, AnimatedSlideUp } from "@/components/animated-components"
import { useI18n } from "@/contexts/i18n-context"
import { useNotifications } from "@/components/notifications"
import { initiatePayment, verifyPayment } from "@/services/payment-service"

export default function ConfirmPurchase({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isDemoMode, worldIDProof } = useWorldAppAuth()
  const { isApiAvailable, isChecking } = useApiAvailability()
  const [sorteo, setSorteo] = useState<Sorteo | null>(null)
  const [purchaseDetails, setPurchaseDetails] = useState({
    selectedNumbers: [] as string[],
    quantity: 0,
    totalCost: 0,
  })
  const { t } = useI18n()
  const { showNotification } = useNotifications()

  useEffect(() => {
    const numbersParam = searchParams.get("numbers")
    if (numbersParam) {
      const selectedNumbers = numbersParam.split(",")
      setPurchaseDetails((prev) => ({
        ...prev,
        selectedNumbers,
        quantity: selectedNumbers.length,
      }))
    }
  }, [searchParams])

  useEffect(() => {
    const fetchRaffleDetails = async () => {
      try {
        if (isDemoMode || !isApiAvailable || isChecking) {
          const sampleRaffle: Sorteo = {
            id: params.id,
            nombre: "Sorteo de Ejemplo",
            descripcion: "Este es un sorteo de ejemplo para mostrar cuando hay errores de carga.",
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
              fecha_fin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              estado: "ACTIVO",
            },
            numeros_vendidos: [],
            creado_por: "sistema",
            fecha_creacion: new Date(),
            fecha_actualizacion: new Date(),
          }
          setSorteo(sampleRaffle)
          setPurchaseDetails((prev) => ({
            ...prev,
            totalCost: sampleRaffle.configuracion.precio_por_numero * prev.quantity,
          }))
        } else {
          const response = await getSorteoById(params.id)
          if (response.error || !response.data) {
            throw new Error(response.error || "No se encontraron datos del sorteo")
          }
          setSorteo(response.data)
          setPurchaseDetails((prev) => ({
            ...prev,
            totalCost: (response.data?.configuracion?.precio_por_numero || 0) * prev.quantity,
          }))
        }
      } catch (error: any) {
        console.error("Error al cargar detalles del sorteo:", error)
        setError(error.message || "No se pudieron cargar los detalles del sorteo")
        showNotification("error", t("errors.raffleNotFound", "errors"))
      }
    }
    fetchRaffleDetails()
  }, [params.id, isDemoMode, isApiAvailable, isChecking, t, showNotification])

  const handleConfirmPurchase = async () => {
    setIsProcessing(true)
    setError(null)
    try {
      if (!worldIDProof && !isDemoMode) {
        throw new Error(t("errors.verificationFailed", "errors"))
      }
      const reference = `raffle_${params.id}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      const paymentResult = await initiatePayment({
        amount: purchaseDetails.totalCost,
        token: "WLD",
        reference: reference,
        description: `Compra de ${purchaseDetails.quantity} número(s) para el sorteo: ${sorteo?.nombre || params.id}`,
      })
      if (!paymentResult.success) {
        throw new Error(paymentResult.error || t("errors.transactionFailed", "errors"))
      }
      const verificationResult = await verifyPayment(paymentResult.data.transaction_id, reference)
      if (!verificationResult.success) {
        throw new Error(verificationResult.error || t("errors.transactionFailed", "errors"))
      }
      if (isDemoMode || verificationResult.data.status === "completed") {
        showNotification("success", t("raffles.purchaseSuccess", "raffles"))
        router.push(`/raffle/${params.id}/success?numbers=${purchaseDetails.selectedNumbers.join(",")}`)
      } else {
        throw new Error(t("errors.transactionFailed", "errors"))
      }
    } catch (error: any) {
      console.error("Error al procesar la compra:", error)
      setError(error.message || "No se pudo procesar la compra")
      showNotification("error", error.message || t("errors.transactionFailed", "errors"))
      setIsProcessing(false)
    }
  }

  if (!purchaseDetails.selectedNumbers.length && !isChecking) {
    router.push(`/raffle/${params.id}`)
    return null
  }

  return (
    <main className="min-h-screen pb-24 bg-wt-background">
      <Header />
      <div className="p-4 max-w-md mx-auto">
        <AnimatedSlideUp>
          <Link href={`/raffle/${params.id}`} className="flex items-center text-wt-text-secondary mb-6">
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t("common.back", "common")}
          </Link>
        </AnimatedSlideUp>
        <AnimatedScale>
          <h1 className="font-bold text-xl mb-6 text-wt-text">{t("raffles.confirmPurchase", "raffles")}</h1>
        </AnimatedScale>
        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4 flex items-center text-sm text-red-800 dark:text-red-300">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        <AnimatedScale delay={0.1} className="card mb-8">
          <h2 className="font-bold mb-5 text-wt-text">{sorteo?.nombre || t("common.loading", "common")}</h2>
          <div className="space-y-4 mb-2">
            <div className="flex justify-between">
              <span className="text-wt-text-secondary">{t("raffles.selectedNumbers", "raffles")}:</span>
              <span className="font-bold text-wt-text">{purchaseDetails.selectedNumbers.join(", ")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-wt-text-secondary">{t("raffles.quantity", "raffles")}:</span>
              <span className="text-wt-text">{purchaseDetails.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-wt-text-secondary">{t("raffles.price", "raffles")}:</span>
              <span className="text-wt-text">{sorteo?.configuracion.precio_por_numero || 0} WLD</span>
            </div>
            <div className="h-px bg-wt-card-border my-2"></div>
            <div className="flex justify-between">
              <span className="text-wt-text-secondary">{t("raffles.totalCost", "raffles")}:</span>
              <span className="font-bold text-wt-text">{purchaseDetails.totalCost} WLD</span>
            </div>
          </div>
        </AnimatedScale>
        <AnimatedSlideUp delay={0.2}>
          <button className="wt-button wt-button-accent w-full" onClick={handleConfirmPurchase} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {t("common.processing", "common")}...
              </>
            ) : (
              t("raffles.confirmPurchase", "raffles")
            )}
          </button>
        </AnimatedSlideUp>
      </div>
      <Navigation />
    </main>
  )
}