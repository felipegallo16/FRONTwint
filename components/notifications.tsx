"use client"

import { useState, createContext, useContext, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, AlertCircle, Info, X } from "lucide-react"

type NotificationType = "success" | "error" | "info"

interface Notification {
  id: string
  type: NotificationType
  message: string
  duration?: number
}

interface NotificationsContextType {
  notifications: Notification[]
  showNotification: (type: NotificationType, message: string, duration?: number) => void
  hideNotification: (id: string) => void
}

const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  showNotification: () => {},
  hideNotification: () => {},
})

export function useNotifications() {
  return useContext(NotificationsContext)
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const showNotification = (type: NotificationType, message: string, duration = 5000) => {
    const id = Date.now().toString()
    setNotifications((prev) => [...prev, { id, type, message, duration }])

    if (duration > 0) {
      setTimeout(() => {
        hideNotification(id)
      }, duration)
    }
  }

  const hideNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  return (
    <NotificationsContext.Provider value={{ notifications, showNotification, hideNotification }}>
      {children}
      <NotificationsContainer />
    </NotificationsContext.Provider>
  )
}

function NotificationsContainer() {
  const { notifications, hideNotification } = useNotifications()

  return (
    <div className="fixed bottom-20 left-0 right-0 z-50 flex flex-col items-center pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            className="mb-2 w-full max-w-md px-4 pointer-events-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className={`rounded-lg shadow-lg p-4 flex items-start ${
                notification.type === "success"
                  ? "bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                  : notification.type === "error"
                    ? "bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                    : "bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
              }`}
            >
              <div className="flex-shrink-0 mr-3">
                {notification.type === "success" ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : notification.type === "error" ? (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                ) : (
                  <Info className="w-5 h-5 text-blue-500" />
                )}
              </div>
              <div className="flex-1 mr-2">
                <p
                  className={`text-sm ${
                    notification.type === "success"
                      ? "text-green-800 dark:text-green-300"
                      : notification.type === "error"
                        ? "text-red-800 dark:text-red-300"
                        : "text-blue-800 dark:text-blue-300"
                  }`}
                >
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => hideNotification(notification.id)}
                className={`flex-shrink-0 ${
                  notification.type === "success"
                    ? "text-green-500 hover:text-green-700"
                    : notification.type === "error"
                      ? "text-red-500 hover:text-red-700"
                      : "text-blue-500 hover:text-blue-700"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
