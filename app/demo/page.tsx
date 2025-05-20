"use client"

import { useState, useEffect } from "react"
import { AuthButton } from "@/components/auth-button"
import { Pay } from "@/components/pay"
import { Verify } from "@/components/verify"
import { useWorldAppAuth } from "@/components/world-app-integration"
import { useRouter } from "next/navigation"
import { Button } from "@worldcoin/mini-apps-ui-kit-react"

export default function DemoPage() {
  const { isAuthenticated, isLoading, username, enableDemoMode } = useWorldAppAuth()
  const [showComponents, setShowComponents] = useState(false)
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [backendError, setBackendError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Si no está autenticado después de cargar, activar modo demo
    if (!isLoading && !isAuthenticated) {
      enableDemoMode()
    }

    // Mostrar componentes después de un breve retraso
    const timer = setTimeout(() => {
      setShowComponents(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [isLoading, isAuthenticated, enableDemoMode])

  const handleVerificationComplete = () => {
    console.log("Verificación completada exitosamente")
  }

  const checkBackendConnection = async () => {
    setBackendStatus('checking')
    setBackendError(null)
    
    try {
      console.log("Checking backend connection...")
      
      // Usar el proxy de Next.js
      const response = await fetch('/api/health', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      })
      
      console.log("Backend response status:", response.status)
      
      if (response.ok) {
        setBackendStatus('online')
        const data = await response.json()
        console.log("Backend response:", data)
      } else {
        const errorText = await response.text()
        console.error("Backend error response:", errorText)
        setBackendStatus('offline')
        setBackendError(`Error ${response.status}: ${errorText}`)
      }
    } catch (error: any) {
      console.error("Backend connection error:", error)
      setBackendStatus('offline')
      
      let errorMessage = "Error de conexión con el backend"
      
      if (error.message.includes("Failed to fetch")) {
        errorMessage = "No se pudo conectar con el servidor. Verifica que el servidor esté funcionando y que la URL sea correcta."
      } else if (error.message.includes("CORS")) {
        errorMessage = "Error de CORS. El servidor no permite peticiones desde este origen."
      } else {
        errorMessage = error.message
      }
      
      setBackendError(errorMessage)
    }
  }

  // Debug info
  console.log("API URL:", process.env.NEXT_PUBLIC_API_URL)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">World App Integration Demo</h1>

      {/* Debug info display */}
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p className="text-sm font-mono mb-2">
          API URL: {process.env.NEXT_PUBLIC_API_URL || "No configurada"}
        </p>
        <div className="flex items-center gap-2">
          <Button 
            onClick={checkBackendConnection}
            variant="secondary"
            size="sm"
          >
            Probar Conexión Backend
          </Button>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              backendStatus === 'checking' ? 'bg-yellow-500' :
              backendStatus === 'online' ? 'bg-green-500' :
              'bg-red-500'
            }`} />
            <span className="text-sm">
              {backendStatus === 'checking' ? 'Verificando...' :
               backendStatus === 'online' ? 'Backend Online' :
               'Backend Offline'}
            </span>
          </div>
        </div>
        {backendError && (
          <p className="text-red-500 text-sm mt-2">{backendError}</p>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          {isAuthenticated ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
              <p className="text-green-700">
                Authenticated as <span className="font-bold">{username}</span>
              </p>
            </div>
          ) : (
            <div className="mb-8">
              <AuthButton />
            </div>
          )}

          {showComponents && (
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <Verify 
                  raffleId="demo-raffle-1" 
                  onVerificationComplete={handleVerificationComplete}
                />
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <Pay />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
