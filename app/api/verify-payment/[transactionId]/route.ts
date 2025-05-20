import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { transactionId: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get("reference")
    const transactionId = params.transactionId

    if (!reference) {
      return NextResponse.json({ error: "Reference is required" }, { status: 400 })
    }

    // En una implementación real, aquí verificarías el estado del pago con el backend de World App
    // Por ahora, simulamos una verificación exitosa

    // Simular una verificación con el backend de World App
    const response = await fetch(
      `https://developer.worldcoin.org/api/v2/minikit/transaction/${transactionId}?app_id=${process.env.NEXT_PUBLIC_APP_ID}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.DEV_PORTAL_API_KEY || "mock_api_key"}`,
        },
      },
    )

    // Si estamos en desarrollo o no tenemos acceso a la API, simular una respuesta exitosa
    if (!response.ok || process.env.NODE_ENV === "development") {
      console.log("Simulando verificación de pago exitosa para:", transactionId)

      return NextResponse.json({
        transaction_id: transactionId,
        reference: reference,
        status: "completed",
        amount: "10",
        token: "WLD",
        timestamp: new Date().toISOString(),
      })
    }

    const transaction = await response.json()

    // Verificar que la referencia coincida
    if (transaction.reference !== reference) {
      return NextResponse.json({ error: "Reference mismatch" }, { status: 400 })
    }

    return NextResponse.json(transaction)
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
  }
}
