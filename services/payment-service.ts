import { pay, type PayOptions } from "@/lib/minikit"

// Interfaz para los detalles de pago
export interface PaymentDetails {
  amount: number
  token: string
  reference: string
  description: string
}

// Función para iniciar un pago
export async function initiatePayment(details: PaymentDetails) {
  try {
    // Crear un ID de referencia único si no se proporciona uno
    const reference = details.reference || `payment_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    // Configurar las opciones de pago
    const payOptions: PayOptions = {
      app_id: process.env.NEXT_PUBLIC_WORLD_APP_ID || process.env.NEXT_PUBLIC_APP_ID || "",
      amount: details.amount,
      token: details.token,
      reference: reference,
      recipient: "0xYourRecipientAddress", // Dirección del destinatario (tu dirección de recepción)
      metadata: {
        description: details.description,
      },
    }

    // Llamar al comando pay de MiniKit
    const result = await pay(payOptions)

    if (result.status === "error" || !result.data) {
      throw new Error(result.error || "Payment failed")
    }

    return {
      success: true,
      data: result.data,
      reference: reference,
    }
  } catch (error) {
    console.error("Payment initiation failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown payment error",
      reference: details.reference,
    }
  }
}

// Función para verificar el estado de un pago
export async function verifyPayment(transactionId: string, reference: string) {
  try {
    // En una implementación real, aquí verificarías el estado del pago con el backend
    // Por ahora, simulamos una verificación exitosa

    // Verificar si estamos en modo de demostración
    const isDemoMode = localStorage.getItem("wintrust_demo_mode") === "true"

    if (isDemoMode) {
      // Simular una verificación exitosa en modo demo
      return {
        success: true,
        data: {
          transaction_id: transactionId,
          reference: reference,
          status: "completed",
        },
      }
    }

    // En una implementación real, aquí harías una llamada a tu backend para verificar el pago
    const response = await fetch(`/api/verify-payment/${transactionId}?reference=${reference}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Payment verification failed with status: ${response.status}`)
    }

    const data = await response.json()

    return {
      success: true,
      data: data,
    }
  } catch (error) {
    console.error("Payment verification failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown verification error",
    }
  }
}
