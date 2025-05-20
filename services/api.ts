// services/api.ts
import type {
  Sorteo,
  EstadoDetallado,
  NotificacionUsuario,
  ParticipacionRequest,
  ParticipacionResponse,
} from "@/types/sorteo";

// Constantes
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.example.com";
const API_TIMEOUT = 8000; // 8 segundos

// Tipos
interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

// Función base para hacer peticiones
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = API_TIMEOUT): Promise<Response> {
  const controller = new AbortController();
  const { signal } = controller;

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal,
      headers: {
        ...options.headers,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Obtener el token de autenticación
function getAuthToken() {
  return localStorage.getItem("wintrust_session");
}

// Función para reintentar una operación
async function retry<T>(operation: () => Promise<T>, retries = 3, delay = 1000, backoff = 2): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }

    await new Promise((resolve) => setTimeout(resolve, delay));

    return retry(operation, retries - 1, delay * backoff, backoff);
  }
}

// Función genérica para hacer peticiones a la API
async function apiRequest<T>(
  endpoint: string,
  method = "GET",
  body?: any,
  headers?: HeadersInit,
  shouldRetry = true,
): Promise<ApiResponse<T>> {
  const operation = async () => {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const token = getAuthToken();

      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...headers,
        },
        credentials: "include",
      };

      if (body && method !== "GET") {
        options.body = JSON.stringify(body);
      }

      const response = await fetchWithTimeout(url, options);
      const status = response.status;

      let data;
      try {
        data = await response.json();
      } catch (e) {
        data = await response.text();
      }

      if (!response.ok && (response.status >= 500 || response.status === 408)) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      if (!response.ok) {
        return {
          error: data.error || "Error en la petición",
          status,
        };
      }

      return {
        data,
        status,
      };
    } catch (error) {
      throw error;
    }
  };

  try {
    if (shouldRetry) {
      return await retry(operation);
    } else {
      return await operation();
    }
  } catch (error: any) {
    console.error("Error en apiRequest:", error);
    return {
      error: error.message || "Error desconocido",
      status: error.status || 500,
    };
  }
}

// Funciones específicas para cada endpoint
export async function getSorteos() {
  return apiRequest<Sorteo[]>("/sorteos");
}

export async function getSorteoById(id: string) {
  return apiRequest<Sorteo>(`/sorteos/${id}`);
}

export async function getEstadoSorteo(id: string) {
  return apiRequest<EstadoDetallado>(`/sorteos/${id}/estado`);
}

export async function getGanadorSorteo(id: string) {
  return apiRequest<{ numero: number; nullifier_hash_masked: string }>(`/sorteos/${id}/ganador`);
}

export async function getNotificacionesUsuario(userId: string) {
  return apiRequest<NotificacionUsuario[]>(`/sorteos/notificaciones/${userId}`);
}

export async function participarEnSorteo(data: ParticipacionRequest) {
  return apiRequest<ParticipacionResponse>(`/sorteos/participar`, "POST", data);
}

export async function getAvailableNumbers(raffleId: string) {
  const response = await getSorteoById(raffleId);

  if (response.error || !response.data) {
    return {
      error: response.error || "No se pudo obtener información del sorteo",
      status: response.status,
    };
  }

  const sorteo = response.data;
  const totalNumeros = sorteo.configuracion.total_numeros;
  const numerosVendidos = sorteo.numeros_vendidos;

  const numerosDisponibles = [];
  for (let i = 1; i <= totalNumeros; i++) {
    if (!numerosVendidos.includes(i)) {
      numerosDisponibles.push(i.toString().padStart(2, "0"));
    }
  }

  return {
    data: {
      available: numerosDisponibles,
      unavailable: numerosVendidos.map((num) => num.toString().padStart(2, "0")),
    },
    status: 200,
  };
}

// Función para verificar si el backend está disponible
// services/api.ts
export async function checkApiStatus(): Promise<boolean> {
  try {
    console.log("Verificando estado de la API en:", process.env.NEXT_PUBLIC_API_URL);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/nonce`, {
      method: "GET",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    console.log("Estado de la respuesta de la API:", response.status);
    return response.ok;
  } catch (error) {
    console.error("Error al verificar disponibilidad de API:", error);
    return false;
  }
}