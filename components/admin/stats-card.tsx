"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  color: "blue" | "green" | "purple" | "amber" | "red"
  href?: string
}

export default function StatsCard({ title, value, icon: Icon, color, href }: StatsCardProps) {
  const colorClasses = {
    blue: {
      bg: "bg-blue-100 dark:bg-blue-900/20",
      text: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-500",
    },
    green: {
      bg: "bg-green-100 dark:bg-green-900/20",
      text: "text-green-600 dark:text-green-400",
      iconBg: "bg-green-500",
    },
    purple: {
      bg: "bg-purple-100 dark:bg-purple-900/20",
      text: "text-purple-600 dark:text-purple-400",
      iconBg: "bg-purple-500",
    },
    amber: {
      bg: "bg-amber-100 dark:bg-amber-900/20",
      text: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-500",
    },
    red: {
      bg: "bg-red-100 dark:bg-red-900/20",
      text: "text-red-600 dark:text-red-400",
      iconBg: "bg-red-500",
    },
  }

  const classes = colorClasses[color]

  const CardContent = () => (
    <motion.div className={`card ${classes.bg} border-none`} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-wt-text-secondary mb-1">{title}</h3>
          <p className={`text-2xl font-bold ${classes.text}`}>{value}</p>
        </div>
        <div className={`w-12 h-12 ${classes.iconBg} rounded-full flex items-center justify-center text-white`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  )

  if (href) {
    return (
      <Link href={href}>
        <CardContent />
      </Link>
    )
  }

  return <CardContent />
}
