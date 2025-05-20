"use client"

import { Button, LiveFeedback } from "@worldcoin/mini-apps-ui-kit-react"
import { useState } from "react"
import { getMiniKit } from "@/lib/minikit-mock"
import { Tokens, tokenToDecimals } from "@/lib/minikit"

export function Pay() {
  const [buttonState, setButtonState] = useState<"pending" | "success" | "failed" | undefined>(undefined)

  const onClickPay = async () => {
    const minikit = getMiniKit()
    if (!minikit) {
      console.error("MiniKit not available")
      setButtonState("failed")
      setTimeout(() => {
        setButtonState(undefined)
      }, 3000)
      return
    }

    // Lets use Alex's username to pay!
    const address = (await minikit.getUserByUsername("alex")).walletAddress
    setButtonState("pending")

    const res = await fetch("/api/initiate-payment", {
      method: "POST",
    })
    const { id } = await res.json()

    const result = await minikit.commandsAsync.pay({
      reference: id,
      to: address ?? "0x0000000000000000000000000000000000000000",
      tokens: [
        {
          symbol: Tokens.WLD,
          token_amount: tokenToDecimals(0.5, Tokens.WLD).toString(),
        },
        {
          symbol: Tokens.USDCE,
          token_amount: tokenToDecimals(0.1, Tokens.USDCE).toString(),
        },
      ],
      description: "Test example payment for minikit",
    })

    console.log(result.finalPayload)
    if (result.finalPayload.status === "success") {
      setButtonState("success")
      // It's important to actually check the transaction result on-chain
      // You should confirm the reference id matches for security
      // Read more here: https://docs.world.org/mini-apps/commands/pay#verifying-the-payment
    } else {
      setButtonState("failed")
      setTimeout(() => {
        setButtonState(undefined)
      }, 3000)
    }
  }

  return (
    <div className="grid w-full gap-4">
      <p className="text-lg font-semibold">Pay</p>
      <LiveFeedback
        label={{
          failed: "Payment failed",
          pending: "Payment pending",
          success: "Payment successful",
        }}
        state={buttonState}
        className="w-full"
      >
        <Button
          onClick={onClickPay}
          disabled={buttonState === "pending"}
          size="lg"
          variant="primary"
          className="w-full"
        >
          Pay
        </Button>
      </LiveFeedback>
    </div>
  )
}
