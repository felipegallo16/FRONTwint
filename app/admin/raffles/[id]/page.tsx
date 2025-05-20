"use client"

import React, { useState, useEffect } from "react"
import { getSorteoById } from "@/services/api"
import type { Sorteo } from "@/types/sorteo"

export default function RaffleDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params) // Desenvolver la promesa para obtener el id
  const [sorteo, setSorteo] = useState<Sorteo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Datos de muestra para cuando la API no está disponible
        const sampleRaffles: Sorteo[] = [
          {
            id: "1",
            nombre: "iPhone 15 Pro Giveaway",
            descripcion: "Win the latest iPhone 15 Pro with 256GB storage.",
            tipo: "MATERIAL", // Usamos un valor específico de TipoSorteo
            premio: {
              tipo: "MATERIAL",
              descripcion: "iPhone 15 Pro",
              valor: 1000,
              moneda: "USD"
            },
            configuracion: {
              precio_por_numero: 5,
              total_numeros: 1000,
              fecha_fin: new Date("2025-05-30"),
              estado: "ACTIVO",
              imagen_url: "/images/iphone.jpg"
            },
            numeros_vendidos: Array.from({ length: 450 }, (_, i) => i + 1),
            creado_por: "admin",
            fecha_creacion: new Date("2023-01-01"),
            fecha_actualizacion: new Date("2023-01-01")
          }
          // Puedes agregar más datos de muestra si es necesario
        ]

        const raffleData = sampleRaffles.find((r) => r.id === id)
        if (!raffleData) {
          throw new Error("Sorteo no encontrado")
        }
        setSorteo(raffleData) // Datos de muestra correctamente tipados

        // Llamada a la API real (descomenta si aplica)
        // const response = await getSorteoById(id)
        // if (response.error) {
        //   throw new Error(response.error)
        // }
        // setSorteo(response.data || null) // Manejo de undefined con null
      } catch (error: any) {
        console.error("Error al cargar datos:", error)
        setError(error.message || "Error al cargar datos")
        setSorteo(null) // En caso de error, asignamos null
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  // Resto del componente...
}