"use client";

import { useEffect, useCallback } from "react";
import { useWorldAppAuth } from "@/components/world-app-integration";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isWorldIDVerified, verifyWithWorldID } = useWorldAppAuth();
  const router = useRouter();

  // Memoizar verifyAdminAccess para evitar recreaciones
  const verifyAdminAccess = useCallback(async () => {
    if (isWorldIDVerified) {
      console.log("Usuario ya verificado, omitiendo verificación");
      return;
    }

    try {
      console.log("Iniciando verificación de World ID");
      const { success } = await verifyWithWorldID();
      if (!success) {
        console.error("Verificación fallida, redirigiendo a login");
        router.push("/login");
      }
    } catch (error) {
      console.error("Error en verificación:", error);
      router.push("/login");
    }
  }, [isWorldIDVerified, verifyWithWorldID, router]);

  useEffect(() => {
    verifyAdminAccess();
  }, [verifyAdminAccess]); // Dependencia memoizada

  return <>{children}</>;
}