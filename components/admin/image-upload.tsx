"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Upload, X } from "lucide-react"
import { useI18n } from "@/contexts/i18n-context"

interface ImageUploadProps {
  initialImage?: string
  onImageChange: (imageFile: File | null, imagePreview: string | null) => void
  className?: string
}

export default function ImageUpload({ initialImage, onImageChange, className = "" }: ImageUploadProps) {
  const { t } = useI18n()
  const [preview, setPreview] = useState<string | null>(initialImage || null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (initialImage) {
      setPreview(initialImage)
    }
  }, [initialImage])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const imagePreview = reader.result as string
        setPreview(imagePreview)
        onImageChange(file, imagePreview)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      const reader = new FileReader()

      reader.onloadend = () => {
        const imagePreview = reader.result as string
        setPreview(imagePreview)
        onImageChange(file, imagePreview)
      }

      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onImageChange(null, null)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`w-full ${className}`}>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      {!preview ? (
        <motion.div
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isDragging
              ? "border-wt-primary bg-wt-primary/10"
              : "border-gray-300 dark:border-gray-700 hover:border-wt-primary hover:bg-wt-primary/5"
          }`}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <Upload className="w-10 h-10 text-wt-text-secondary mb-2" />
          <p className="text-wt-text font-medium mb-1">{t("admin.uploadImage", "common")}</p>
          <p className="text-wt-text-secondary text-sm text-center">{t("admin.dragAndDropOrClick", "common")}</p>
          <p className="text-wt-text-secondary text-xs mt-2">{t("admin.maxFileSize", "common")}: 5MB</p>
        </motion.div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
          <img
            src={preview || "/placeholder.svg"}
            alt={t("admin.raffleImage", "common")}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
            <motion.button
              className="bg-white text-red-500 p-2 rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                handleRemoveImage()
              }}
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      )}
    </div>
  )
}
