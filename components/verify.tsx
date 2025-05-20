"use client"

import { Button, LiveFeedback } from "@worldcoin/mini-apps-ui-kit-react"
import { useState } from "react"
import { getMiniKit } from "@/lib/minikit-mock"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from 'uuid'
import { toast } from "sonner"
import { MiniKit } from "@worldcoin/minikit-js"

// Definir VerificationLevel si no está disponible
export enum VerificationLevel {
  Device = "device",
  Orb = "orb",
}

interface VerifyProps {
  raffleId: string
  onVerificationComplete?: () => void
}

export function Verify({ raffleId, onVerificationComplete }: VerifyProps) {
  const [buttonState, setButtonState] = useState<"pending" | "success" | "failed" | "loading" | undefined>(undefined)
  const [whichVerification, setWhichVerification] = useState<VerificationLevel>(VerificationLevel.Device)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()

  const onClickVerify = async () => {
    try {
      setButtonState('loading');
      setErrorMessage(null);

      // Verificar que la URL del backend esté configurada
      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('Backend URL not configured');
      }

      console.log('Backend URL:', process.env.NEXT_PUBLIC_API_URL);

      // Obtener el MiniKit
      const minikit = await getMiniKit();
      if (!minikit) {
        throw new Error('Failed to initialize MiniKit');
      }

      // Generar un signal único para esta verificación
      const signal = uuidv4();

      // Realizar la verificación
      const verificationResult = await minikit.commandsAsync.verify({
        action: 'wintrust_verify_human',
        signal,
        verification_level: whichVerification,
      });

      console.log('Verification result:', verificationResult.finalPayload);

      if (verificationResult.finalPayload.status !== 'success') {
        throw new Error('Verification failed');
      }

      // Preparar el cuerpo de la petición
      const requestBody = {
        raffleId,
        proof: {
          nullifier_hash: verificationResult.finalPayload.nullifier_hash,
          merkle_root: verificationResult.finalPayload.merkle_root,
          proof: verificationResult.finalPayload.proof,
          verification_level: verificationResult.finalPayload.verification_level
        },
        action: 'wintrust_verify_human',
        signal,
        cantidad_numeros: 1
      };

      console.log('Request body:', requestBody);
      console.log('Making request to:', `/api/sorteos/participar`);

      // Realizar la petición a través del endpoint de Next.js
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sorteos/participar`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          if (errorData?.error === 'Proof already used') {
            throw new Error('Esta prueba ya ha sido utilizada. Por favor, genera una nueva verificación.');
          }
          if (errorData?.error === 'Sorteo no encontrado') {
            throw new Error('El sorteo no existe o no está disponible. Por favor, verifica el ID del sorteo.');
          }
          throw new Error(errorData?.error || `Error del servidor: ${response.status}`);
        }

        const data = await response.json();
        console.log('Backend response:', data);

        if (data.status === 'ok') {
          setButtonState('success');
          toast.success('¡Verificación exitosa! Has participado en el sorteo.');
          if (onVerificationComplete) {
            onVerificationComplete();
          }
          setTimeout(() => {
            setButtonState(undefined);
          }, 2000);
        } else {
          throw new Error(data.error || 'Error desconocido del backend');
        }
      } catch (fetchError: unknown) {
        console.error('Fetch error details:', {
          name: fetchError instanceof Error ? fetchError.name : 'Unknown',
          message: fetchError instanceof Error ? fetchError.message : 'Unknown error',
          stack: fetchError instanceof Error ? fetchError.stack : undefined
        });
        
        if (fetchError instanceof TypeError && fetchError.message === 'Failed to fetch') {
          throw new Error('No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet.');
        }
        throw fetchError;
      }

    } catch (error: unknown) {
      console.error('Error during verification:', error);
      setButtonState('failed');
      
      // Manejar diferentes tipos de errores
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        setErrorMessage('Error de conexión con el backend. Por favor, verifica tu conexión a internet y que el servidor esté funcionando.');
      } else if (error instanceof Error && error.message.includes('CORS')) {
        setErrorMessage('Error de configuración CORS. Por favor, contacta al administrador.');
      } else if (error instanceof Error) {
        setErrorMessage(error.message || 'Error durante la verificación');
      } else {
        setErrorMessage('Error desconocido durante la verificación');
      }
      
      toast.error(error instanceof Error ? error.message : 'Error durante la verificación');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">Verificación</h3>
        <p className="text-sm text-gray-500">
          Selecciona el nivel de verificación que deseas realizar
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Button
          onClick={() => {
            setWhichVerification(VerificationLevel.Device)
            onClickVerify()
          }}
          disabled={buttonState === "pending" || buttonState === "loading"}
          size="lg"
          variant="tertiary"
        >
          Verificar con Device
        </Button>

        <Button
          onClick={() => {
            setWhichVerification(VerificationLevel.Orb)
            onClickVerify()
          }}
          disabled={buttonState === "pending" || buttonState === "loading"}
          size="lg"
          variant="primary"
        >
          Verificar con Orb
        </Button>
      </div>

      {errorMessage && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {errorMessage}
        </div>
      )}
    </div>
  );
}