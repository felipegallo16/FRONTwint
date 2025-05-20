"use client"

import { useState, useCallback, useEffect } from "react"
import { Button, LiveFeedback } from "@worldcoin/mini-apps-ui-kit-react"
import { walletAuth } from "@/lib/minikit"
import { getMiniKit } from "@/lib/minikit-mock"

export function AuthButton() {
  const [isPending, setIsPending] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Verificar si MiniKit está instalado
    const minikit = getMiniKit()
    setIsInstalled(!!minikit)
  }, [])

  const onClick = useCallback(async () => {
    if (!isInstalled || isPending) {
      return
    }

    setIsPending(true)

    try {
      await walletAuth({})
    } catch (error) {
      console.error("Wallet authentication button error", error)
    } finally {
      setIsPending(false)
    }
  }, [isInstalled, isPending])

  useEffect(() => {
    const authenticate = async () => {
      if (isInstalled && !isPending) {
        setIsPending(true)
        try {
          await walletAuth({})
        } catch (error) {
          console.error("Auto wallet authentication error", error)
        } finally {
          setIsPending(false)
        }
      }
    }

    authenticate()
  }, [isInstalled, isPending])

  return (
    <LiveFeedback
      label={{
        failed: "Failed to login",
        pending: "Logging in",
        success: "Logged in",
      }}
      state={isPending ? "pending" : undefined}
    >
      <Button onClick={onClick} disabled={isPending} size="lg" variant="primary">
        Login with Wallet
      </Button>
    </LiveFeedback>
  )
}
