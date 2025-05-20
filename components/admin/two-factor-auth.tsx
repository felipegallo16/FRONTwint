"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Loader2, Shield, Check } from "lucide-react"
import { useI18n } from "@/contexts/i18n-context"

interface TwoFactorAuthProps {
  onVerify: (code: string) => Promise<boolean>
  onCancel: () => void
}

export default function TwoFactorAuth({ onVerify, onCancel }: TwoFactorAuthProps) {
  const { t } = useI18n()
  const [code, setCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isVerified, setIsVerified] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (code.length < 6) {
      setError(t("admin.invalidCode", "common"))
      return
    }

    setIsVerifying(true)
    setError(null)

    try {
      const success = await onVerify(code)

      if (success) {
        setIsVerified(true)
      } else {
        setError(t("admin.invalidCode", "common"))
      }
    } catch (err) {
      setError(t("admin.verificationError", "common"))
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-wt-card p-6 rounded-lg shadow-lg max-w-md w-full"
    >
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-wt-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          {isVerified ? <Check className="w-8 h-8 text-green-500" /> : <Shield className="w-8 h-8 text-wt-primary" />}
        </div>
        <h2 className="text-xl font-bold text-wt-text mb-2">
          {isVerified ? t("admin.verificationSuccessful", "common") : t("admin.twoFactorRequired", "common")}
        </h2>
        <p className="text-wt-text-secondary">
          {isVerified ? t("admin.redirecting", "common") : t("admin.enterCode", "common")}
        </p>
      </div>

      {!isVerified && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
              className="input text-center text-2xl tracking-widest"
              placeholder="000000"
              maxLength={6}
              autoFocus
              aria-label={t("admin.enterCode", "common")}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="wt-button wt-button-outline flex-1"
              disabled={isVerifying}
            >
              {t("common.cancel", "common")}
            </button>
            <button
              type="submit"
              className="wt-button wt-button-primary flex-1"
              disabled={isVerifying || code.length < 6}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {t("common.verifying", "common")}
                </>
              ) : (
                t("common.verify", "common")
              )}
            </button>
          </div>
        </form>
      )}
    </motion.div>
  )
}
