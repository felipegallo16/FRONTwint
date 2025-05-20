"use client"
import { Button, LiveFeedback } from "@worldcoin/mini-apps-ui-kit-react"
import { MiniKit } from "@worldcoin/minikit-js"
import { useState } from "react"

/**
 * This component is used to sign typed data (EIP-712) with the user's wallet
 * It's useful for structured data signing
 */
export const SignTypedData = () => {
  const [buttonState, setButtonState] = useState<"pending" | "success" | "failed" | undefined>(undefined)
  const [signature, setSignature] = useState<string>("")

  const onClickSignTyped = async () => {
    setButtonState("pending")
    try {
      // EIP-712 typed data example
      const typedData = {
        types: {
          EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
          ],
          Person: [
            { name: "name", type: "string" },
            { name: "wallet", type: "address" },
          ],
          Mail: [
            { name: "from", type: "Person" },
            { name: "to", type: "Person" },
            { name: "contents", type: "string" },
          ],
        },
        primaryType: "Mail",
        domain: {
          name: "WinTrust Mini App",
          version: "1",
          chainId: 1,
          verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
        },
        message: {
          from: {
            name: "Alice",
            wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
          },
          to: {
            name: "Bob",
            wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
          },
          contents: "Hello, Bob!",
        },
      }

      const { finalPayload } = await MiniKit.commandsAsync.signTypedData({
        data: typedData,
      })

      if (finalPayload.status === "success") {
        setSignature(finalPayload.signature)
        setButtonState("success")
      } else {
        console.error("Signing typed data failed:", finalPayload)
        setButtonState("failed")
        setTimeout(() => {
          setButtonState(undefined)
        }, 3000)
      }
    } catch (err) {
      console.error("Error signing typed data:", err)
      setButtonState("failed")
      setTimeout(() => {
        setButtonState(undefined)
      }, 3000)
    }
  }

  return (
    <div className="grid w-full gap-4">
      <p className="text-lg font-semibold">Sign Typed Data</p>
      <LiveFeedback
        label={{
          failed: "Signing failed",
          pending: "Signing data",
          success: "Data signed",
        }}
        state={buttonState}
        className="w-full"
      >
        <Button
          onClick={onClickSignTyped}
          disabled={buttonState === "pending"}
          size="lg"
          variant="primary"
          className="w-full"
        >
          Sign Typed Data
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
