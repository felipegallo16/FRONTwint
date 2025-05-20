"use client"

import WinTrustLogo from "./wintrust-logo"

export default function Header() {
  return (
    <header>
      <WinTrustLogo size={28} className="text-wt-primary" /> {/* Sin animated */}
    </header>
  )
}