"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Home, Gift, Users, BarChart, Settings, LogOut } from "lucide-react"
import { useWorldAppAuth } from "@/components/world-app-integration"
import { useI18n } from "@/contexts/i18n-context"
import WinTrustLogo from "@/components/wintrust-logo"

export default function AdminSidebar() {
  const pathname = usePathname()
  const { logout } = useWorldAppAuth() // logout ahora está definido
  const { t } = useI18n()

  const navItems = [
    { href: "/admin", icon: Home, label: t("admin.dashboard", "common") },
    { href: "/admin/raffles", icon: Gift, label: t("admin.raffles", "common") },
    { href: "/admin/users", icon: Users, label: t("admin.users", "common") },
    { href: "/admin/stats", icon: BarChart, label: t("admin.statistics", "common") },
    { href: "/admin/settings", icon: Settings, label: t("admin.settings", "common") },
  ]

  return (
    <aside className="fixed left-0 top-0 w-64 h-full bg-wt-card border-r border-wt-card-border shadow-sm z-10">
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-3 mb-8">
          <WinTrustLogo size={40} />
          <span className="font-bold text-lg text-wt-text">Admin</span>
        </Link>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-wt-primary text-white" : "text-wt-text-secondary hover:bg-wt-background hover:text-wt-text"}`}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </motion.div>
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="absolute bottom-0 left-0 w-full p-6">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>{t("common.logout", "common")}</span>
        </button>
      </div>
    </aside>
  )
}