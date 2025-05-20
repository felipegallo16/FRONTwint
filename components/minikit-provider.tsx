"use client"

import { MiniKit } from "@worldcoin/minikit-js"
import { type ReactNode, useEffect, useState } from "react"

interface MiniKitProviderProps {
  children: ReactNode
  appId?: string
}

export default function MiniKitProvider({ children, appId }: MiniKitProviderProps) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Instalar MiniKit con el appId opcional
    try {
      MiniKit.install(appId)
      setIsReady(true)
      console.log("MiniKit installed successfully")
    } catch (error) {
      console.error("Error installing MiniKit:", error)
    }
  }, [appId])

  return <>{children}</>
}
