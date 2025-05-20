"use server"

import { cookies } from "next/headers"
import { MiniKit } from "@worldcoin/minikit-js"

/**
 * Generate a nonce for SIWE authentication
 * @returns A random nonce
 */
export async function generateNonce() {
  // Generate a random nonce
  const nonce = crypto.randomUUID().replace(/-/g, "")

  // Store the nonce in a cookie
  cookies().set("siwe", nonce, {
    secure: true,
    httpOnly: true,
    maxAge: 60 * 10, // 10 minutes
    path: "/",
  })

  return nonce
}

/**
 * Authenticate a user with their wallet
 * This function will trigger the wallet auth flow in World App
 * @returns The wallet address of the authenticated user
 */
export async function walletAuth() {
  try {
    // Generate a nonce
    const nonce = await generateNonce()

    // Call the wallet auth command
    const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
      nonce,
      expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      statement: "Sign in to WinTrust Mini App",
    })

    if (finalPayload.status === "error") {
      throw new Error("Wallet authentication failed")
    }

    // Verify the signature on the server
    const verifyResponse = await fetch("/api/verify-wallet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payload: finalPayload,
        nonce,
      }),
    })

    const verifyData = await verifyResponse.json()

    if (!verifyData.isValid) {
      throw new Error("Signature verification failed")
    }

    return finalPayload.address
  } catch (error) {
    console.error("Wallet authentication error", error)
    throw error
  }
}
