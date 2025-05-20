"use client"

import { Home, Trophy, User, HelpCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

export default function Navigation() {
  const pathname = usePathname()

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 backdrop-blur-md bg-wt-background/90 border-t border-wt-card-border px-6 py-3"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center justify-around">
        <Link
          href="/"
          className={`flex flex-col items-center p-2 ${
            pathname === "/" ? "text-wt-primary" : "text-wt-text-secondary"
          }`}
          aria-label="Home"
          aria-current={pathname === "/" ? "page" : undefined}
        >
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.9 }}>
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1">Home</span>
          </motion.div>
        </Link>
        <Link
          href="/results"
          className={`flex flex-col items-center p-2 ${
            pathname === "/results" ? "text-wt-primary" : "text-wt-text-secondary"
          }`}
          aria-label="Results"
          aria-current={pathname === "/results" ? "page" : undefined}
        >
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.9 }}>
            <Trophy className="w-5 h-5" />
            <span className="text-xs mt-1">Results</span>
          </motion.div>
        </Link>
        <Link
          href="/faqs"
          className={`flex flex-col items-center p-2 ${
            pathname === "/faqs" ? "text-wt-primary" : "text-wt-text-secondary"
          }`}
          aria-label="FAQs"
          aria-current={pathname === "/faqs" ? "page" : undefined}
        >
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.9 }}>
            <HelpCircle className="w-5 h-5" />
            <span className="text-xs mt-1">FAQs</span>
          </motion.div>
        </Link>
        <Link
          href="/profile"
          className={`flex flex-col items-center p-2 ${
            pathname === "/profile" ? "text-wt-primary" : "text-wt-text-secondary"
          }`}
          aria-label="Profile"
          aria-current={pathname === "/profile" ? "page" : undefined}
        >
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.9 }}>
            <User className="w-5 h-5" />
            <span className="text-xs mt-1">Profile</span>
          </motion.div>
        </Link>
      </div>
    </motion.nav>
  )
}
