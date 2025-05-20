"use client"
import { Button, LiveFeedback } from "@worldcoin/mini-apps-ui-kit-react"
import { MiniKit } from "@worldcoin/minikit-js"
import { useState } from "react"

/**
 * This component is used to sign a message with the user's wallet
 * It's useful for proving ownership of a wallet address
 */
export const SignMessage = () => {
  const [buttonState, setButtonState] = useState<"pending" | "success" | "failed" | undefined>(undefined)
  const [signature, setSignature] = useState<string>("")

  const onClickSign = async () => {
    setButtonState("pending")
    try {
      const message = `Hello World! This is a test message signed at ${new Date().toISOString()}`

      const { finalPayload } = await MiniKit.commandsAsync.signMessage({
        message,
      })

      if (finalPayload.status === "success") {
        setSignature(finalPayload.signature)
        setButtonState("success")
      } else {
        console.error("Signing failed:", finalPayload)
        setButtonState("failed")
        setTimeout(() => {
          setButtonState(undefined)
        }, 3000)
      }
    } catch (err) {
      console.error("Error signing message:", err)
      setButtonState("failed")
      setTimeout(() => {
        setButtonState(undefined)
      }, 3000)
    }
  }

  return (
    <div className="grid w-full gap-4">
      <p className="text-lg font-semibold">Sign Message</p>
      <LiveFeedback
        label={{
          failed: "Signing failed",
          pending: "Signing message",
          success: "Message signed",
        }}
        state={buttonState}
        className="w-full"
      >
        <Button
          onClick={onClickSign}
          disabled={buttonState === "pending"}
          size="lg"
          variant="primary"
          className="w-full"
        >
          Sign Message
        </Button>
      </LiveFeedback>

      {signature && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md overflow-auto">
          <p className="font-mono text-xs break-all">{signature}</p>
        </div>
      )}
    </div>
  )
}
