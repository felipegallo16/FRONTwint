"use client"

import { motion, stagger, useAnimate } from "framer-motion"
import { useEffect, useState } from "react"
import type { ReactNode, ButtonHTMLAttributes } from "react"

interface AnimatedProps {
  children: ReactNode
  delay?: number
  className?: string
}

export function AnimatedSlideUp({ children, delay = 0, className = "" }: AnimatedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedScale({ children, delay = 0, className = "" }: AnimatedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        delay,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  forceParticipa?: boolean
}

export function AnimatedButton({
  children,
  onClick,
  className = "",
  forceParticipa = false,
  ...props
}: AnimatedButtonProps) {
  // Variantes para la animación del botón
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.01 },
    tap: { scale: 0.99 },
    // Variante especial para el botón "¡PARTICIPÁ!"
    participaHover: {
      scale: 1.02,
      boxShadow: "0 0 8px rgba(94, 23, 235, 0.5)",
    },
    participaTap: {
      scale: 0.98,
    },
  }

  // Determinar si es el botón "¡PARTICIPÁ!"
  const isParticipaButton =
    forceParticipa ||
    (typeof children === "string" && children.includes("PARTICIPÁ")) ||
    (typeof children === "object" &&
      "props" in children &&
      typeof children.props.children === "string" &&
      children.props.children.includes("PARTICIPÁ"))

  return (
    <motion.button
      variants={buttonVariants}
      initial="initial"
      whileHover={isParticipaButton ? "participaHover" : "hover"}
      whileTap={isParticipaButton ? "participaTap" : "tap"}
      onClick={onClick}
      className={`text-sm px-4 py-2 rounded-md ${className}`}
      style={{
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        transition: "box-shadow 0.2s ease",
      }}
      {...props}
    >
      {children}
    </motion.button>
  )
}

// Componentes de animación escalonada
interface AnimatedStaggerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
}

export function AnimatedStagger({ children, className = "", staggerDelay = 0.1 }: AnimatedStaggerProps) {
  const [scope, animate] = useAnimate()
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (!hasAnimated) {
      animate(
        "div",
        { opacity: 1, y: 0 },
        {
          duration: 0.4,
          delay: stagger(staggerDelay),
          ease: "easeOut",
        },
      )
      setHasAnimated(true)
    }
  }, [animate, hasAnimated, staggerDelay])

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  )
}

export function AnimatedStaggerItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      style={{
        opacity: 0,
        transform: "translateY(20px)",
      }}
      className={className}
    >
      {children}
    </div>
  )
}
