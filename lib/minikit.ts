// lib/minikit.ts
"use client";

import { getMiniKit, tokenToDecimals, Tokens, MockMiniKit } from "./minikit-mock";

// Interfaces para las opciones y respuestas de los comandos
export interface WalletAuthOptions {
  app_id?: string;
  nonce?: string;
  statement?: string;
}

export interface WalletAuthResponse {
  address: string;
  username?: string;
}

export interface VerifyOptions {
  app_id?: string;
  action: string;
  signal?: string;
  verification_level?: string;
}

export interface VerifyResponse {
  merkle_root: string;
  nullifier_hash: string;
  proof: string;
  verification_level: string;
}

export interface PayOptions {
  app_id?: string;
  amount: number;
  token: string;
  reference: string;
  recipient: string;
  metadata?: {
    description: string;
  };
}

// Verificar si estamos en un entorno de navegador
const isBrowser = typeof window !== "undefined";

// Función para instalar MiniKit
export const installMiniKit = (): boolean => {
  if (!isBrowser) {
    console.error("No se puede instalar MiniKit fuera del navegador");
    return false;
  }

  try {
    const appId = process.env.NEXT_PUBLIC_WORLD_APP_ID || process.env.NEXT_PUBLIC_APP_ID;
    console.log("Intentando instalar MiniKit con APP_ID:", appId);

    if (!appId) {
      console.error("Falta NEXT_PUBLIC_WORLD_APP_ID o NEXT_PUBLIC_APP_ID");
      return false;
    }

    const minikit = getMiniKit();
    if (minikit) {
      console.log("MiniKit encontrado, instalando...");
      minikit.install(appId);
      console.log("MiniKit instalado con éxito");
      return true;
    } else {
      console.error("No se pudo obtener MiniKit. ¿Estás en World App?");
      return false;
    }
  } catch (error) {
    console.error("Error al instalar MiniKit:", error);
    return false;
  }
};

// Función para autenticación con wallet
export const walletAuth = async (
  options: WalletAuthOptions,
): Promise<{
  status: "success" | "error";
  data?: WalletAuthResponse;
  error?: string;
}> => {
  try {
    if (!isBrowser) {
      throw new Error("MiniKit can only be used in browser environment");
    }

    const minikit = getMiniKit();
    if (!minikit) {
      throw new Error("MiniKit not available");
    }

    console.log("Ejecutando walletAuth con opciones:", options);
    const result = await minikit.commandsAsync.walletAuth({
      nonce: options.nonce || Date.now().toString(),
      statement: options.statement || "Sign in to WinTrust",
    });

    console.log("Resultado de walletAuth:", result);

    if (result.finalPayload.status === "error") {
      throw new Error(result.finalPayload.error || "Wallet authentication failed");
    }

    return {
      status: "success",
      data: {
        address: result.finalPayload.address,
        username: result.finalPayload.username,
      },
    };
  } catch (error) {
    console.error("Error in walletAuth:", error);
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error in walletAuth",
    };
  }
};

// Función para verificación con World ID
export const verify = async (
  options: VerifyOptions,
): Promise<{
  status: "success" | "error";
  data?: VerifyResponse;
  error?: string;
}> => {
  try {
    if (!isBrowser) {
      throw new Error("MiniKit can only be used in browser environment");
    }

    const minikit = getMiniKit();
    if (!minikit) {
      throw new Error("MiniKit not available");
    }

    console.log("Ejecutando verify con opciones:", options);
    const result = await minikit.commandsAsync.verify({
      action: options.action,
      verification_level: options.verification_level || "device",
      signal: options.signal,
    });

    console.log("Resultado de verify:", result);

    if (result.finalPayload.status === "error") {
      throw new Error(result.finalPayload.error || "Verification failed");
    }

    return {
      status: "success",
      data: {
        merkle_root: result.finalPayload.merkle_root,
        nullifier_hash: result.finalPayload.nullifier_hash,
        proof: result.finalPayload.proof,
        verification_level: result.finalPayload.verification_level,
      },
    };
  } catch (error) {
    console.error("Error in verify:", error);
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error in verify",
    };
  }
};

// Función para iniciar un pago
export async function pay(options: PayOptions) {
  try {
    if (!isBrowser) {
      throw new Error("MiniKit can only be used in browser environment");
    }

    const minikit = getMiniKit();
    if (!minikit) {
      throw new Error("MiniKit not available");
    }

    console.log("Ejecutando pay con opciones:", options);
    const result = await minikit.commandsAsync.pay({
      reference: options.reference,
      to: options.recipient,
      tokens: [
        {
          symbol: options.token as (typeof Tokens)[keyof typeof Tokens],
          token_amount: tokenToDecimals(options.amount, options.token).toString(),
        },
      ],
      description: options.metadata?.description || "",
    });

    console.log("Resultado de pay:", result);

    if (result.finalPayload.status === "error") {
      return {
        status: "error",
        error: result.finalPayload.error || "Payment failed",
      };
    }

    return {
      status: "success",
      data: result.finalPayload,
    };
  } catch (error) {
    console.error("Payment error:", error);
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Unknown payment error",
    };
  }
}

// Exportamos MiniKit para uso directo
export { MockMiniKit as MiniKit, tokenToDecimals, Tokens };