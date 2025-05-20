import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { payload, action } = body

    // En una aplicación real, aquí verificarías la prueba con la API de World ID
    // Por ahora, simplemente simulamos una verificación exitosa

    return NextResponse.json({
      verifyRes: {
        success: true,
        action,
      },
    })
  } catch (error) {
    console.error("Error verifying proof:", error)
    return NextResponse.json(
      {
        verifyRes: {
          success: false,
          error: "Failed to verify proof",
        },
      },
      { status: 400 },
    )
  }
}
