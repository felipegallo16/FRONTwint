"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, Calendar, DollarSign, Hash, Clock, Info, ImageIcon } from "lucide-react"
import { useI18n } from "@/contexts/i18n-context"
import type { Sorteo, TipoSorteo } from "@/types/sorteo"
import ImageUpload from "./image-upload"

interface RaffleFormProps {
  initialData?: Partial<Sorteo>
  onSubmit: (data: Partial<Sorteo>) => void
  isSubmitting: boolean
  submitButtonText: React.ReactNode
}

export default function RaffleForm({ initialData, onSubmit, isSubmitting, submitButtonText }: RaffleFormProps) {
  const { t } = useI18n()
  const [formData, setFormData] = useState<Partial<Sorteo>>({
    nombre: "",
    descripcion: "",
    tipo: "MATERIAL",
    premio: { tipo: "MATERIAL", descripcion: "", valor: 0, moneda: "USD" },
    configuracion: { precio_por_numero: 1, total_numeros: 100, fecha_fin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), estado: "BORRADOR", imagen_url: "" },
    ...initialData,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.configuracion?.imagen_url || null)

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }))
      if (initialData.configuracion?.imagen_url) setImagePreview(initialData.configuracion.imagen_url)
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name.includes(".")) {
      const [section, field] = name.split(".")
      setFormData((prev) => {
        const sectionData = prev[section as keyof typeof prev]
        if (typeof sectionData === "object" && sectionData !== null) {
          return { ...prev, [section]: { ...sectionData, [field]: value } }
        }
        return prev
      })
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numValue = Number.parseFloat(value)
    if (name.includes(".")) {
      const [section, field] = name.split(".")
      setFormData((prev) => {
        const sectionData = prev[section as keyof typeof prev]
        if (typeof sectionData === "object" && sectionData !== null) {
          return { ...prev, [section]: { ...sectionData, [field]: isNaN(numValue) ? 0 : numValue } }
        }
        return prev
      })
    } else {
      setFormData((prev) => ({ ...prev, [name]: isNaN(numValue) ? 0 : numValue }))
    }
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const date = new Date(value)
    if (name.includes(".")) {
      const [section, field] = name.split(".")
      setFormData((prev) => {
        const sectionData = prev[section as keyof typeof prev]
        if (typeof sectionData === "object" && sectionData !== null) {
          return { ...prev, [section]: { ...sectionData, [field]: date } }
        }
        return prev
      })
    } else {
      setFormData((prev) => ({ ...prev, [name]: date }))
    }
  }

  const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tipo = e.target.value as TipoSorteo
    setFormData((prev) => ({
      ...prev,
      tipo,
      premio: tipo === "TOKEN" ? { tipo: "TOKEN", cantidad: 100, token: "WLD" } : { tipo: "MATERIAL", descripcion: "", valor: 0, moneda: "USD" },
    }))
  }

  const handleImageChange = (file: File | null, preview: string | null) => {
    setImageFile(file)
    setImagePreview(preview)
    setFormData((prev) => ({
      ...prev,
      configuracion: { ...prev.configuracion!, imagen_url: preview ?? undefined },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let updatedFormData = { ...formData }
    if (imageFile) {
      console.log("Subiendo imagen:", imageFile.name)
      const imageUrl = imagePreview ?? ""
      updatedFormData = { ...updatedFormData, configuracion: { ...updatedFormData.configuracion!, imagen_url: imageUrl } }
    }
    onSubmit(updatedFormData)
  }

  const formatDateForInput = (date: Date | string | undefined) => {
    if (!date) return ""
    const d = new Date(date)
    return d.toISOString().split("T")[0]
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-wt-text mb-4">{t("admin.basicInfo", "common")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-wt-text-secondary mb-1">
                {t("admin.raffleName", "common")} *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre || ""}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            <div>
              <label htmlFor="tipo" className="block text-sm font-medium text-wt-text-secondary mb-1">
                {t("admin.raffleType", "common")} *
              </label>
              <select
                id="tipo"
                name="tipo"
                value={formData.tipo || "MATERIAL"}
                onChange={handleTipoChange}
                className="input"
                required
              >
                <option value="MATERIAL">{t("raffles.type.material", "raffles")}</option>
                <option value="TOKEN">{t("raffles.type.token", "raffles")}</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="descripcion" className="block text-sm font-medium text-wt-text-secondary mb-1">
              {t("admin.description", "common")} *
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion || ""}
              onChange={handleChange}
              className="input min-h-[100px]"
              required
            />
          </div>
        </div>
        {/* Resto del formulario: mantener igual o completar según necesidades */}
      </div>
    </form>
  )
}