"use client"

import { useState, useCallback } from "react"
import { Home, Play, Trophy, Settings, Camera, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

type NavPage = "home" | "play" | "results" | "settings"

interface NavBarProps {
  currentPage: NavPage
  onNavigate: (page: NavPage) => void
}

const navItems: { id: NavPage; label: string; icon: React.ElementType }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "play", label: "Play", icon: Play },
  { id: "results", label: "Results", icon: Trophy },
  { id: "settings", label: "Settings", icon: Settings },
]

export default function NavBar({ currentPage, onNavigate }: NavBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNav = useCallback(
    (page: NavPage) => {
      onNavigate(page)
      setMobileOpen(false)
    },
    [onNavigate]
  )

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-2">
          <Camera className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold text-foreground">ChromaDetect</span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = currentPage === item.id
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            )
          })}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = currentPage === item.id
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 px-6 py-3 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            )
          })}
        </div>
      )}
    </nav>
  )
}

export type { NavPage }
