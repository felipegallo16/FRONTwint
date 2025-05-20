"use client"

import { useState, useEffect } from "react"
import { MiniKit, VerificationLevel } from "@worldcoin/minikit-js"

interface WorldIDProof {
  merkle_root: string
  nullifier_hash: string
  proof: string
}

interface WorldAppAuth {
  isWorldIDVerified: boolean
  isLoading: boolean
  worldIDProof: WorldIDProof | null
  isDemoMode: boolean
  setIsDemoMode: (mode: boolean) => void
  username: string | null
  verifyWithWorldID: () => Promise<{ success: boolean; proof?: WorldIDProof; error?: string }>
  setWorldIDVerificationStatus: (status: boolean) => void
  setWorldIDProof: (proof: WorldIDProof | null) => void
  logout: () => void
}

export function useWorldAppAuth(): WorldAppAuth {
  const [isWorldIDVerified, setIsWorldIDVerified] = useState(() => {
    if (typeof window === "undefined") return false
    return localStorage.getItem("wintrust_verified") === "true"
  })
  const [worldIDProof, setWorldIDProof] = useState<WorldIDProof | null>(() => {
    if (typeof window === "undefined") return null
    const storedProof = localStorage.getItem("wintrust_proof")
    return storedProof ? JSON.parse(storedProof) : null
  })
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [username] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") {
      console.log("Ejecutando en el servidor, MiniKit no disponible")
      return
    }
    if (!MiniKit.isInstalled()) {
      console.warn("MiniKit no está instalado")
    } else {
      console.log("MiniKit está instalado correctamente")
    }
  }, [])

  const verifyWithWorldID = async () => {
    setIsLoading(true)
    try {
      if (typeof window === "undefined" || !MiniKit.isInstalled()) {
        throw new Error("MiniKit no está instalado")
      }
      console.log("Iniciando verificación con World ID...")
      const { finalPayload } = await MiniKit.commandsAsync.verify({
        action: "wintrust_verify_human",
        signal: "raffle-participation",
        verification_level: VerificationLevel.Device,
      })
      if (finalPayload.status === "success") {
        const proof: WorldIDProof = {
          merkle_root: finalPayload.merkle_root || "",
          nullifier_hash: finalPayload.nullifier_hash || "",
          proof: finalPayload.proof || "",
        }
        setWorldIDProof(proof)
        setIsWorldIDVerified(true)
        localStorage.setItem("wintrust_verified", "true")
        localStorage.setItem("wintrust_proof", JSON.stringify(proof))
        console.log("Verificación exitosa:", proof)
        return { success: true, proof }
      } else {
        throw new Error("Verificación fallida con estado: " + finalPayload.status)
      }
    } catch (error: any) {
      console.error("Error de verificación:", error)
      return { success: false, error: error.message || "Error desconocido durante la verificación" }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setIsWorldIDVerified(false)
    setWorldIDProof(null)
    localStorage.removeItem("wintrust_verified")
    localStorage.removeItem("wintrust_proof")
  }

  return {
    isWorldIDVerified,
    isLoading,
    worldIDProof,
    isDemoMode,
    setIsDemoMode,
    username,
    verifyWithWorldID,
    setWorldIDVerificationStatus: setIsWorldIDVerified,
    setWorldIDProof,
    logout,
  }
}