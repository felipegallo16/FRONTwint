"use client"

import { MiniKit } from "@worldcoin/minikit-js"
import { useState } from "react"

interface WorldIDVerificationProps {
  onVerificationComplete: (success: boolean) => void
  buttonText: string
}

export default function WorldIDVerification({ onVerificationComplete, buttonText }: WorldIDVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false)

  const handleVerify = async () => {
    setIsVerifying(true)
    try {
      const { finalPayload } = await MiniKit.commandsAsync.verify({
        action: "wintrust_verify_human",
        signal: "raffle-participation",
      })
      if (finalPayload.status === "success") {
        onVerificationComplete(true)
      } else {
        onVerificationComplete(false)
      }
    } catch (error) {
      console.error("Error en la verificación:", error)
      onVerificationComplete(false)
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <button
      onClick={handleVerify}
      disabled={isVerifying}
      className={`wt-button wt-button-primary w-full ${isVerifying ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {isVerifying ? "Verificando..." : buttonText}
    </button>
  )
}