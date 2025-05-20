"use client"

import { motion } from "framer-motion"

interface LoadingSpinnerProps {
  size?: number
  color?: string
  thickness?: number
  text?: string
}

export default function LoadingSpinner({
  size = 40,
  color = "var(--wt-primary)",
  thickness = 2,
  text,
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        className="rounded-full"
        style={{
          width: size,
          height: size,
          border: `${thickness}px solid rgba(0, 0, 0, 0.1)`,
          borderTopColor: color,
          borderRadius: "50%",
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        aria-label="Loading"
      />
      {text && <p className="mt-3 text-sm text-wt-text-secondary">{text}</p>}
    </div>
  )
}
