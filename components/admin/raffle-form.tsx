"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, Calendar, DollarSign, Hash, Clock, Info, ImageIcon, Trophy, Package } from "lucide-react"
import { useI18n } from "@/contexts/i18n-context"
import type { Sorteo, TipoSorteo, EstadoSorteo, PremioToken, PremioMaterial } from "@/types/sorteo"
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
    tipo: "TOKEN",
    premio: { 
      tipo: "TOKEN", 
      token: "WLD",
      cantidad: 0
    },
    configuracion: { 
      estado: "ACTIVO",
      fecha_inicio: new Date(),
      fecha_fin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      total_numeros: 100,
      precio_por_numero: 1,
      imagen_url: "" 
    },
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

  const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tipo = e.target.value as TipoSorteo
    setFormData((prev) => ({
      ...prev,
      tipo,
      premio: tipo === "TOKEN" 
        ? { tipo: "TOKEN", token: "WLD", cantidad: 0 }
        : { tipo: "MATERIAL", descripcion: "", valor: 0, moneda: "USD" }
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Sección de Información Básica */}
      <div className="bg-wt-surface rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-wt-text mb-6">Información del Sorteo</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-wt-text-secondary mb-1">
              Nombre del Sorteo *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre || ""}
              onChange={handleChange}
              className="input"
              placeholder="Ej: Sorteo de 100 WLD"
              required
            />
          </div>
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-wt-text-secondary mb-1">
              Descripción *
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion || ""}
              onChange={handleChange}
              className="input min-h-[100px]"
              placeholder="Describe los detalles del sorteo..."
              required
            />
          </div>
          <div>
            <label htmlFor="tipo" className="block text-sm font-medium text-wt-text-secondary mb-1">
              Tipo de Sorteo *
            </label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo || "TOKEN"}
              onChange={handleTipoChange}
              className="input"
              required
            >
              <option value="TOKEN">Sorteo de Tokens</option>
              <option value="MATERIAL">Sorteo de Material</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sección de Premio */}
      <div className="bg-wt-surface rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-wt-text mb-6">Detalles del Premio</h3>
        <div className="space-y-4">
          {formData.tipo === "TOKEN" ? (
            <>
              <div>
                <label htmlFor="premio.token" className="block text-sm font-medium text-wt-text-secondary mb-1">
                  Token a Sortear *
                </label>
                <select
                  id="premio.token"
                  name="premio.token"
                  value={(formData.premio as PremioToken)?.token || "WLD"}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="WLD">World ID Token (WLD)</option>
                </select>
              </div>
              <div>
                <label htmlFor="premio.cantidad" className="block text-sm font-medium text-wt-text-secondary mb-1">
                  Cantidad de Tokens *
                </label>
                <input
                  type="number"
                  id="premio.cantidad"
                  name="premio.cantidad"
                  value={(formData.premio as PremioToken)?.cantidad || 0}
                  onChange={handleNumberChange}
                  className="input"
                  min="0"
                  step="0.01"
                  placeholder="Ej: 100"
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="premio.descripcion" className="block text-sm font-medium text-wt-text-secondary mb-1">
                  Descripción del Material *
                </label>
                <textarea
                  id="premio.descripcion"
                  name="premio.descripcion"
                  value={(formData.premio as PremioMaterial)?.descripcion || ""}
                  onChange={handleChange}
                  className="input min-h-[100px]"
                  placeholder="Describe el material a sortear..."
                  required
                />
              </div>
              <div>
                <label htmlFor="premio.valor" className="block text-sm font-medium text-wt-text-secondary mb-1">
                  Valor del Material *
                </label>
                <input
                  type="number"
                  id="premio.valor"
                  name="premio.valor"
                  value={(formData.premio as PremioMaterial)?.valor || 0}
                  onChange={handleNumberChange}
                  className="input"
                  min="0"
                  step="0.01"
                  placeholder="Ej: 1000"
                  required
                />
              </div>
              <div>
                <label htmlFor="premio.moneda" className="block text-sm font-medium text-wt-text-secondary mb-1">
                  Moneda *
                </label>
                <select
                  id="premio.moneda"
                  name="premio.moneda"
                  value={(formData.premio as PremioMaterial)?.moneda || "USD"}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="MXN">MXN</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Sección de Configuración */}
      <div className="bg-wt-surface rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-wt-text mb-6">Configuración del Sorteo</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="configuracion.estado" className="block text-sm font-medium text-wt-text-secondary mb-1">
              Estado del Sorteo *
            </label>
            <select
              id="configuracion.estado"
              name="configuracion.estado"
              value={formData.configuracion?.estado || "ACTIVO"}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="ACTIVO">Activo</option>
              <option value="PAUSADO">Pausado</option>
              <option value="FINALIZADO">Finalizado</option>
            </select>
          </div>
          <div>
            <label htmlFor="configuracion.fecha_inicio" className="block text-sm font-medium text-wt-text-secondary mb-1">
              Fecha de Inicio *
            </label>
            <input
              type="date"
              id="configuracion.fecha_inicio"
              name="configuracion.fecha_inicio"
              value={formatDateForInput(formData.configuracion?.fecha_inicio)}
              onChange={handleDateChange}
              className="input"
              required
            />
          </div>
          <div>
            <label htmlFor="configuracion.fecha_fin" className="block text-sm font-medium text-wt-text-secondary mb-1">
              Fecha de Finalización
            </label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <input
                  type="date"
                  id="configuracion.fecha_fin"
                  name="configuracion.fecha_fin"
                  value={formatDateForInput(formData.configuracion?.fecha_fin)}
                  onChange={handleDateChange}
                  className="input"
                  disabled={!formData.configuracion?.fecha_fin}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="fecha_fin_indefinida"
                  checked={!formData.configuracion?.fecha_fin}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      configuracion: {
                        ...prev.configuracion!,
                        fecha_fin: e.target.checked ? undefined : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                      }
                    }))
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-wt-primary focus:ring-wt-primary"
                />
                <label htmlFor="fecha_fin_indefinida" className="text-sm text-wt-text-secondary">
                  Sin fecha de finalización
                </label>
              </div>
            </div>
            <p className="mt-1 text-sm text-wt-text-secondary">
              {!formData.configuracion?.fecha_fin ? 
                "El sorteo permanecerá activo hasta que sea finalizado manualmente" : 
                "El sorteo se finalizará automáticamente en la fecha seleccionada"}
            </p>
          </div>
          <div>
            <label htmlFor="configuracion.total_numeros" className="block text-sm font-medium text-wt-text-secondary mb-1">
              Total de Números Disponibles *
            </label>
            <input
              type="number"
              id="configuracion.total_numeros"
              name="configuracion.total_numeros"
              value={formData.configuracion?.total_numeros || 0}
              onChange={handleNumberChange}
              className="input"
              min="1"
              placeholder="Ej: 100"
              required
            />
          </div>
          <div>
            <label htmlFor="configuracion.precio_por_numero" className="block text-sm font-medium text-wt-text-secondary mb-1">
              Precio por Número (WLD) *
            </label>
            <input
              type="number"
              id="configuracion.precio_por_numero"
              name="configuracion.precio_por_numero"
              value={formData.configuracion?.precio_por_numero || 0}
              onChange={handleNumberChange}
              className="input"
              min="0"
              step="0.01"
              placeholder="Ej: 1.5"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-wt-text-secondary mb-1">
              Imagen del Sorteo
            </label>
            <ImageUpload
              onImageChange={handleImageChange}
              initialImage={imagePreview || undefined}
              className="w-full h-48"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="wt-button wt-button-primary px-8 py-3 text-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            submitButtonText
          )}
        </button>
      </div>
    </form>
  )
}