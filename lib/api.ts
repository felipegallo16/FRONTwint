import type { Sorteo, ActualizacionEstado } from "@/types/sorteo"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://wintrust-backend.onrender.com"

const defaultHeaders = {
  "Content-Type": "application/json",
  "Accept": "application/json"
}

export async function getRaffles(): Promise<Sorteo[]> {
  try {
    console.log("Fetching raffles from:", `${API_URL}/sorteos`)
    const response = await fetch(`${API_URL}/sorteos`, {
      method: "GET",
      headers: defaultHeaders
    })
    
    console.log("Response status:", response.status, response.statusText)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error response:", errorText)
      
      // Si es un error 500, intentamos parsear el mensaje de error
      if (response.status === 500) {
        try {
          const errorJson = JSON.parse(errorText)
          throw new Error(errorJson.error || "Error interno del servidor")
        } catch (e) {
          throw new Error(`Error al obtener los sorteos: ${errorText}`)
        }
      }
      
      throw new Error(`Error al obtener los sorteos: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log("Received data:", data)
    return data
  } catch (error) {
    console.error("Error fetching raffles:", error)
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("This might be a CORS issue. Backend needs to allow requests from this origin.")
    }
    throw error
  }
}

export async function getRaffleById(id: string): Promise<Sorteo> {
  try {
    console.log("Fetching raffle details from:", `${API_URL}/sorteos/${id}`)
    const response = await fetch(`${API_URL}/sorteos/${id}`, {
      method: "GET",
      headers: defaultHeaders
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error response:", errorText)
      
      if (response.status === 500) {
        try {
          const errorJson = JSON.parse(errorText)
          throw new Error(errorJson.error || "Error interno del servidor")
        } catch (e) {
          throw new Error(`Error al obtener el sorteo: ${errorText}`)
        }
      }
      
      throw new Error(`Error al obtener el sorteo: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Raffle details received:", data)
    return data
  } catch (error) {
    console.error("Error in getRaffleById:", error)
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("This might be a CORS issue. Backend needs to allow requests from this origin.")
    }
    throw error
  }
}

export async function createRaffle(raffleData: Partial<Sorteo>): Promise<Sorteo> {
  try {
    const response = await fetch(`${API_URL}/sorteos/crear`, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify(raffleData)
    })
    if (!response.ok) {
      throw new Error("Error al crear el sorteo")
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error creating raffle:", error)
    throw error
  }
}

export async function updateRaffle(id: string, updateData: ActualizacionEstado): Promise<Sorteo> {
  try {
    console.log("Updating raffle with ID:", id)
    console.log("Update data:", updateData)
    
    const response = await fetch(`${API_URL}/sorteos/${id}`, {
      method: "PATCH",
      headers: defaultHeaders,
      body: JSON.stringify(updateData)
    })

    console.log("Update response status:", response.status, response.statusText)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error response:", errorText)
      
      try {
        const errorJson = JSON.parse(errorText)
        throw new Error(errorJson.error || errorJson.message || "Error al actualizar el sorteo")
      } catch (e) {
        if (e instanceof SyntaxError) {
          // Si no se puede parsear como JSON, usar el texto del error
          throw new Error(`Error al actualizar el sorteo: ${errorText}`)
        }
        throw e
      }
    }

    const data = await response.json()
    console.log("Update successful, received data:", data)
    return data
  } catch (error) {
    console.error("Error updating raffle:", error)
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("This might be a CORS issue. Backend needs to allow requests from this origin.")
    }
    throw error
  }
}

export async function deleteRaffle(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/sorteos/${id}`, {
      method: "DELETE",
      headers: defaultHeaders
    })
    if (!response.ok) {
      throw new Error("Error al eliminar el sorteo")
    }
  } catch (error) {
    console.error("Error deleting raffle:", error)
    throw error
  }
} 