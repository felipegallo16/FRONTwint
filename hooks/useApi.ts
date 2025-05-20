"use client"

import { useState, useEffect } from "react"
import { checkApiStatus } from "@/services/api"

// Hook para determinar si debemos usar datos reales o de muestra
export function useApiAvailability() {
  const [isApiAvailable, setIsApiAvailable] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkApi = async () => {
      try {
        const response = await checkApiStatus()
        setIsApiAvailable(response) // Usar directamente el valor booleano
      } catch (error) {
        setIsApiAvailable(false)
      } finally {
        setIsChecking(false)
      }
    }

    checkApi()

    // Verificar cada 30 segundos
    const interval = setInterval(checkApi, 30000)

    return () => clearInterval(interval)
  }, [])

  return { isApiAvailable, isChecking }
}

// Hook genérico para hacer peticiones a la API
export function useApiRequest<T, P = any>(
  apiFunction: (params?: P) => Promise<{ data?: T; error?: string; status: number }>,
  initialData?: T,
  immediate = false,
  initialParams?: P,
) {
  const [data, setData] = useState<T | undefined>(initialData)
  const [isLoading, setIsLoading] = useState(immediate)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<number | null>(null)

  const execute = async (params?: P) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await apiFunction(params)

      setStatus(response.status)

      if (response.error) {
        setError(response.error)
        return false
      }

      setData(response.data)
      return true
    } catch (err: any) {
      setError(err.message || "Error desconocido")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (immediate) {
      execute(initialParams)
    }
  }, [apiFunction, initialParams, immediate])

  return { data, isLoading, error, status, execute }
}