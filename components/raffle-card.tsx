"use client"

import { Trophy, Clock } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { AnimatedButton } from "./animated-components"
import type { EstadoSorteo, TipoSorteo } from "@/types/sorteo"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { useI18n } from "@/contexts/i18n-context"

interface RaffleCardProps {
  id: string
  nombre: string
  descripcion: string
  tipo: TipoSorteo
  premio: any
  configuracion: {
    precio_por_numero: number
    total_numeros: number
    fecha_fin: string | Date
    estado: EstadoSorteo
  }
  numeros_vendidos: number[]
  premio_acumulado?: number
}

export default function RaffleCard({
  id,
  nombre,
  descripcion,
  tipo,
  premio,
  configuracion,
  numeros_vendidos,
  premio_acumulado,
}: RaffleCardProps) {
  const { t } = useI18n()

  const fechaFin = typeof configuracion.fecha_fin === "string" ? new Date(configuracion.fecha_fin) : configuracion.fecha_fin
  const tiempoRestante = formatDistanceToNow(fechaFin, { addSuffix: true, locale: es })
  const porcentajeVendido = configuracion.total_numeros > 0 ? Math.round((numeros_vendidos.length / configuracion.total_numeros) * 100) : 0

  const getEstadoVisual = (estado: EstadoSorteo) => {
    switch (estado) {
      case "ACTIVO":
        return { color: "text-green-500", bgColor: "bg-green-100 dark:bg-green-900/20", text: "SORTEO ACTIVO" }
      case "PAUSADO":
        return { color: "text-amber-500", bgColor: "bg-amber-100 dark:bg-amber-900/20", text: t("raffles.status.paused", "raffles") }
      case "FINALIZADO":
        return { color: "text-red-500", bgColor: "bg-red-100 dark:bg-red-900/20", text: "SORTEO FINALIZADO" }
      case "CANCELADO":
        return { color: "text-red-500", bgColor: "bg-red-100 dark:bg-red-900/20", text: t("raffles.status.cancelled", "raffles") }
      default:
        return { color: "text-gray-500", bgColor: "bg-gray-100 dark:bg-gray-900/20", text: t("raffles.status.draft", "raffles") }
    }
  }

  const estadoVisual = getEstadoVisual(configuracion.estado)
  const getPremioTexto = () => (tipo === "TOKEN" ? `${premio.cantidad} ${premio.token}` : premio.descripcion)

  const badgeVariants = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.05, 1],
      boxShadow: ["0px 0px 0px rgba(0,0,0,0)", "0px 0px 4px rgba(34, 197, 94, 0.5)", "0px 0px 0px rgba(0,0,0,0)"],
      transition: { duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" as const },
    },
  }

  return (
    <motion.div className="card p-4 overflow-hidden" whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <span className={`text-[8px] h-4 px-1.5 rounded-full ${estadoVisual.bgColor} ${estadoVisual.color} inline-flex items-center justify-center uppercase font-medium tracking-tight whitespace-nowrap overflow-hidden`}>
            {estadoVisual.text}
          </span>
          {tipo === "MATERIAL" && configuracion.estado === "ACTIVO" && (
            <motion.div className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium" variants={badgeVariants} initial="initial" animate="animate">
              <span className="mr-1">🏆</span> ¡SALE SÍ O SÍ!
            </motion.div>
          )}
        </div>
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Trophy className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="font-bold text-base text-wt-text">{nombre}</h2>
            <div className="mt-1 flex items-center text-xs">
              <div className="inline-flex mr-1">
                <Trophy className="w-3.5 h-3.5 mr-1 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-wt-text font-medium">{getPremioTexto()}</span>
              {premio_acumulado && tipo === "TOKEN" && (
                <span className="ml-2 text-[10px] bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-full">
                  + {premio_acumulado} {premio.token}
                </span>
              )}
            </div>
          </div>
        </div>
        <p className="text-wt-text-secondary text-xs mb-3 line-clamp-2">{descripcion}</p>
        <div className="flex items-center gap-1 mb-3 text-xs text-wt-text-secondary" aria-label={`Termina en: ${tiempoRestante}`}>
          <div className="inline-flex">
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
          </div>
          <span>Termina en: {tiempoRestante}</span>
        </div>
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-wt-text-secondary">Números vendidos: {numeros_vendidos.length}/{configuracion.total_numeros}</span>
            <span className="font-medium">{porcentajeVendido}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div className="h-full bg-wt-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${porcentajeVendido}%` }} transition={{ duration: 0.8, ease: "easeOut" }} />
          </div>
        </div>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="text-xs">
            <span className="text-wt-text-secondary">PRECIO:</span>
            <span className="font-bold ml-1 text-wt-text" aria-label={`${configuracion.precio_por_numero} WLD`}>{configuracion.precio_por_numero} WLD</span>
          </div>
          {configuracion.estado === "ACTIVO" ? (
            <Link href={`/raffle/${id}`} passHref aria-label={`${t("raffles.participate", "raffles")} ${nombre}`}>
              <AnimatedButton className="wt-button wt-button-primary text-xs py-1.5 px-4">¡PARTICIPÁ!</AnimatedButton>
            </Link>
          ) : configuracion.estado === "FINALIZADO" ? (
            <Link href={`/raffle/${id}/results`} passHref aria-label={`VER GANADORES ${nombre}`}>
              <AnimatedButton className="wt-button wt-button-outline text-xs py-1.5 px-4">VER GANADORES</AnimatedButton>
            </Link>
          ) : (
            <div className="text-xs text-wt-text-secondary italic">{t("common.notAvailable", "common")}</div>
          )}
        </div>
      </div>
    </motion.div>
  )
}