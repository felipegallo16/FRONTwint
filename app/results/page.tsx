"use client"

import Header from "@/components/header"
import Navigation from "@/components/navigation"
import { AnimatedSlideUp, AnimatedStagger, AnimatedStaggerItem } from "@/components/animated-components"
import { Trophy } from "lucide-react"
import { motion } from "framer-motion"

export default function Results() {
  // Estos serían los datos que vendrían de tu API
  const sorteos = [
    {
      id: 1,
      nombre: "Sorteo iPhone 15 Pro",
      fecha: "15/05/2023",
      numeroGanador: "42",
      premio: "iPhone 15 Pro",
      estado: "FINALIZADO",
    },
    {
      id: 2,
      nombre: "Sorteo PlayStation 5",
      fecha: "22/06/2023",
      numeroGanador: "78",
      premio: "PlayStation 5",
      estado: "FINALIZADO",
    },
    {
      id: 3,
      nombre: "Sorteo MacBook Pro",
      fecha: "10/07/2023",
      numeroGanador: "15",
      premio: "MacBook Pro M2",
      estado: "FINALIZADO",
    },
  ]

  return (
    <main id="main-content" className="min-h-screen pb-24 bg-wt-background">
      <Header />

      <div className="p-4 max-w-md mx-auto">
        <AnimatedSlideUp>
          <h1 className="text-xl font-bold mb-6 px-1 text-wt-text">Resultados de Sorteos</h1>
        </AnimatedSlideUp>

        <AnimatedStagger className="space-y-4">
          {sorteos.map((sorteo) => (
            <AnimatedStaggerItem key={sorteo.id}>
              <motion.div className="card" whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                <div className="flex items-start gap-4">
                  <motion.div
                    className="w-12 h-12 bg-[var(--wt-primary-10)] rounded-full flex items-center justify-center flex-shrink-0"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    aria-hidden="true"
                  >
                    <Trophy className="w-6 h-6 text-wt-primary" />
                  </motion.div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h2 className="font-bold text-lg text-wt-text">{sorteo.nombre}</h2>
                      <span className="text-[8px] h-4 px-1.5 rounded-full bg-red-100 dark:bg-red-900/20 text-red-500 inline-flex items-center justify-center uppercase font-medium tracking-tight whitespace-nowrap overflow-hidden">
                        {sorteo.estado}
                      </span>
                    </div>

                    <p className="text-wt-text-secondary text-sm">Fecha del sorteo: {sorteo.fecha}</p>

                    <div className="mt-3 p-3 bg-[var(--wt-primary-10)] rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-wt-text-secondary">Número ganador</p>
                          <p className="text-xl font-bold text-wt-primary">{sorteo.numeroGanador}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-wt-text-secondary">Premio</p>
                          <p className="font-medium text-wt-text">{sorteo.premio}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <button className="wt-button wt-button-outline text-sm py-2 px-5">Ver detalles</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatedStaggerItem>
          ))}
        </AnimatedStagger>
      </div>

      <Navigation />
    </main>
  )
}
