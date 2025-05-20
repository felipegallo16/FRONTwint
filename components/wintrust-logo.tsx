import type { FC } from "react"

interface WinTrustLogoProps {
  size?: number
  showText?: boolean
  className?: string
  variant?: "default" | "light" | "dark" | "outline"
}

const WinTrustLogo: FC<WinTrustLogoProps> = ({ size = 40, showText = true, className = "", variant = "default" }) => {
  // Calculate the viewBox scaling based on the size
  const scale = size / 50
  const scaledWidth = 50 * scale
  const scaledHeight = 50 * scale

  // Define colors based on variant
  let bgColor = "#2563eb" // Default blue
  let trophyColor = "#f8fafc" // Default white
  let strokeColor = "none"
  let strokeWidth = 0

  switch (variant) {
    case "light":
      bgColor = "#f8fafc" // White
      trophyColor = "#2563eb" // Blue
      break
    case "dark":
      bgColor = "#1e293b" // Dark blue
      trophyColor = "#f8fafc" // White
      break
    case "outline":
      bgColor = "transparent"
      trophyColor = "#f8fafc" // White
      strokeColor = "#f8fafc"
      strokeWidth = 2
      break
    default:
      break
  }

  return (
    <div className={`flex items-center ${className}`}>
      <svg width={scaledWidth} height={scaledHeight} viewBox="0 0 50 50" className="flex-shrink-0">
        <rect
          x="5"
          y="5"
          width="40"
          height="40"
          rx="12"
          fill={bgColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
        <path d="M25 10 L32 15 L32 25 L25 30 L18 25 L18 15 Z" fill={trophyColor} stroke={trophyColor} strokeWidth="1" />
        <path d="M20 30 L30 30 L30 35 L25 38 L20 35 Z" fill={trophyColor} />
      </svg>
      {showText && (
        <span className={`ml-2 font-bold text-xl ${variant === "light" ? "text-blue-600" : ""}`}>WinTrust</span>
      )}
    </div>
  )
}

export default WinTrustLogo
