import { jwtVerify, SignJWT } from "jose"

// En producción, esta clave estaría almacenada de forma segura
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "supersecret_jwt_key_change_in_production")

// Verificar sesión de administrador
export async function verifyAdminSession(token: string) {
  try {
    // Verificar el token JWT
    const { payload } = await jwtVerify(token, JWT_SECRET)

    // Verificar que el token sea para un administrador
    if (!payload.isAdmin) {
      return { valid: false, error: "Not an admin token" }
    }

    // Verificar que el token no haya expirado
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) {
      return { valid: false, error: "Token expired" }
    }

    return { valid: true, payload }
  } catch (error) {
    console.error("Error verifying admin session:", error)
    return { valid: false, error: "Invalid token" }
  }
}

// Crear token de sesión para administrador
export async function createAdminSession(walletAddress: string) {
  try {
    // Crear un token JWT que expire en 2 horas
    const token = await new SignJWT({ walletAddress, isAdmin: true })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(JWT_SECRET)

    return { token }
  } catch (error) {
    console.error("Error creating admin session:", error)
    return { error: "Failed to create session" }
  }
}

// Verificar si una dirección de wallet tiene permisos de administrador
export async function isAdminWallet(walletAddress: string) {
  // En una implementación real, esto consultaría una base de datos
  const adminWallets = ["0xadmin", process.env.ADMIN_WALLET_ADDRESS]

  return adminWallets.includes(walletAddress)
}
