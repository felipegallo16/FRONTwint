import { NextResponse } from "next/server"

export async function POST() {
  // Generar un ID único para el pago
  const id = `payment_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

  // En una aplicación real, aquí guardarías el ID en una base de datos
  // junto con información adicional sobre el pago

  return NextResponse.json({ id })
}
