"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // Verificar si estamos en modo desarrollo
  const isDevelopment = process.env.NODE_ENV === "development";

  useEffect(() => {
    // En desarrollo, permitir acceso directo
    if (!isDevelopment) {
      // En producción, podrías implementar una verificación de admin diferente
      // Por ejemplo, usando un token JWT o una sesión de administrador
      console.log("Acceso a administración en producción");
    }
  }, [isDevelopment]);

  return <>{children}</>;
}