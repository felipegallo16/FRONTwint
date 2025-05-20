"use client"

// Verificar si estamos en el navegador
const isBrowser = typeof window !== "undefined";

// Simulación de MiniKit para desarrollo
export const MockMiniKit = {
  isInstalled: () => true,
  install: (appId: string) => console.log("Mock MiniKit installed with appId:", appId),
  unsubscribeAll: () => console.log("Mock MiniKit unsubscribed from all events"),
  user: {
    username: "demo_user",
    walletAddress: "0xdemo1234567890abcdef1234567890abcdef123456",
  },
  commandsAsync: {
    walletAuth: async (options: any) => {
      console.log("Mock walletAuth called with options:", options)
      return {
        commandPayload: { status: "success" },
        finalPayload: {
          status: "success",
          address: "0xdemo1234567890abcdef1234567890abcdef123456",
          username: "demo_user",
        },
      }
    },
    verify: async ({ action, verification_level, signal }: { action: string, verification_level: string, signal?: string }) => {
      console.warn("Mock verify called with options:", { action, verification_level, signal })
      return {
        commandPayload: { status: "success" },
        finalPayload: {
          status: "success",
          merkle_root: "0x1234567890abcdef",
          nullifier_hash: "0xabcdef1234567890",
          proof: "0x...",
          verification_level: verification_level || "device",
        },
      }
    },
    pay: async (options: any) => {
      console.log("Mock pay called with options:", options)
      return {
        commandPayload: { status: "success" },
        finalPayload: {
          status: "success",
          transaction_id: "tx_" + Math.random().toString(36).substring(2, 15),
        },
      }
    },
    sendTransaction: async (options: any) => {
      console.log("Mock sendTransaction called with options:", options)
      return {
        commandPayload: { status: "success" },
        finalPayload: {
          status: "success",
          transaction_id: "tx_" + Math.random().toString(36).substring(2, 15),
        },
      }
    },
    signMessage: async (options: any) => {
      console.log("Mock signMessage called with options:", options)
      return {
        commandPayload: { status: "success" },
        finalPayload: {
          status: "success",
          signature: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        },
      }
    },
    signTypedData: async (options: any) => {
      console.log("Mock signTypedData called with options:", options)
      return {
        commandPayload: { status: "success" },
        finalPayload: {
          status: "success",
          signature: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        },
      }
    },
  },
  getUserByUsername: async (username: string) => {
    console.log("Mock getUserByUsername called with username:", username)
    return {
      walletAddress: "0xdemo1234567890abcdef1234567890abcdef123456",
      username: username,
    }
  },
}

// Definir la interfaz para MiniKit
interface MiniKit {
  isInstalled: () => boolean;
  install: (appId: string) => void;
  unsubscribeAll: () => void;
  user: {
    username: string;
    walletAddress: string;
  };
  commandsAsync: {
    walletAuth: (options: any) => Promise<any>;
    verify: (options: { action: string, verification_level: string, signal?: string }) => Promise<any>;
    pay: (options: any) => Promise<any>;
    sendTransaction: (options: any) => Promise<any>;
    signMessage: (options: any) => Promise<any>;
    signTypedData: (options: any) => Promise<any>;
  };
  getUserByUsername: (username: string) => Promise<any>;
}

// Función para instalar MiniKit
export const installMiniKit = (): boolean => {
  if (typeof window === "undefined") {
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

// Función para obtener MiniKit (real o simulado)
export function getMiniKit(): MiniKit | null {
  if (typeof window !== "undefined") {
    console.log("Checking for MiniKit...");
    console.log("Window.MiniKit:", window.MiniKit);
    console.log("Navigator.userAgent:", navigator.userAgent); // Añade esto para verificar el entorno
    if (window.MiniKit) {
      console.log("Using real MiniKit from World App");
      return window.MiniKit as MiniKit;
    }
    console.warn("World App not detected, using MockMiniKit");
    return MockMiniKit;
  }
  console.error("Window undefined, cannot load MiniKit");
  return null;
}

// Exportar funciones simuladas para tokenToDecimals
export const tokenToDecimals = (amount: number, token: string) => {
  const decimals = token === "WLD" ? 18 : 6
  return BigInt(amount * 10 ** decimals)
}

export const Tokens = {
  WLD: "WLD",
  USDCE: "USDCE",
} as const