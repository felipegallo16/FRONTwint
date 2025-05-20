export type TipoSorteo = "TOKEN" | "MATERIAL"
export type EstadoSorteo = "BORRADOR" | "ACTIVO" | "PAUSADO" | "FINALIZADO" | "CANCELADO"

export interface PremioToken {
  tipo: "TOKEN"
  cantidad: number
  token: string
}

export interface PremioMaterial {
  tipo: "MATERIAL"
  descripcion: string
  valor: number
  moneda: string
}

export type Premio = PremioToken | PremioMaterial

export interface Sorteo {
  id: string
  nombre: string
  descripcion: string
  tipo: TipoSorteo
  premio: Premio
  configuracion: {
    precio_por_numero: number
    total_numeros: number
    fecha_fin: Date
    fecha_inicio?: Date
    minimo_numeros_vendidos?: number
    maximo_numeros_por_usuario?: number
    porcentaje_minimo_vendido?: number
    reglas_especiales?: string
    imagen_url?: string
    estado: EstadoSorteo
  }
  numeros_vendidos: number[]
  premio_acumulado?: number
  sorteo_anterior?: string
  creado_por: string
  fecha_creacion: Date
  fecha_actualizacion: Date
  ganador?: {
    numero: number
    nullifier_hash: string
  }
}

export interface EstadoDetallado {
  id: string
  nombre: string
  estado: string
  fechaFin: Date
  numerosVendidos: number
  totalNumeros: number
  porcentajeVendido: number
  premio: Premio
  premioAcumulado?: number
  ganador?: {
    numero: number
    nullifier_hash_masked: string
  }
}

export interface NotificacionSorteo {
  tipo: "FINALIZACION" | "GANADOR" | "ACUMULACION" | "CANCELACION"
  sorteoId: string
  nombre: string
  mensaje: string
  fecha: Date
  datos: {
    numerosComprados?: number[]
    esGanador?: boolean
    premio?: Premio
    premioAcumulado?: number
  }
}

export interface NotificacionUsuario {
  raffleId: string
  nombre: string
  estado: string
  numerosComprados: number[]
  esGanador: boolean
  fechaFin: Date
  premio: Premio
  premioAcumulado?: number
}

export interface ParticipacionRequest {
  raffleId: string
  numero_elegido?: number
  cantidad_numeros?: number
  proof: {
    nullifier_hash: string
    merkle_root: string
    proof: string
    verification_level: string
  }
  action: string
}

export interface ParticipacionResponse {
  mensaje: string
  numeros_asignados: number[]
  nullifier_hash_masked: string
}

export interface ErrorResponse {
  error: string
  codigo?: string
  detalles?: any
}
