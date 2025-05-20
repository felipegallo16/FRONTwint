import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { type MiniAppWalletAuthSuccessPayload, verifySiweMessage } from "@worldcoin/minikit-js"

interface IRequestPayload {
  payload: MiniAppWalletAuthSuccessPayload
  nonce: string
}

export async function POST(req: NextRequest) {
  try {
    const { payload, nonce } = (await req.json()) as IRequestPayload
    const storedNonce = (await cookies()).get("siwe")?.value // Usar await

    if (nonce !== storedNonce) {
      return NextResponse.json({
        status: "error",
        isValid: false,
        message: "Invalid nonce",
      })
    }

    const validMessage = await verifySiweMessage(payload, nonce)

    return NextResponse.json({
      status: "success",
      isValid: validMessage.isValid,
      address: payload.address,
    })
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      isValid: false,
      message: error.message,
    })
  }
}