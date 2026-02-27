"use client"

import { Eye, Zap, Target, Palette } from "lucide-react"

interface DashboardProps {
  lastDetectedColor: string | null
  colorHistory: { color: string; name: string; timestamp: Date }[]
  score: number
  onStartDetection: () => void
  gamificationEnabled: boolean
  currentChallenge: string | null
}

const FEATURE_CARDS = [
  {
    icon: Eye,
    title: "Real-Time Detection",
    description: "Point your camera at any object and instantly detect its dominant color using advanced computer vision.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "HSV-based color analysis running in real-time for immediate feedback on every frame.",
  },
  {
    icon: Target,
    title: "Color Challenges",
    description: "Complete fun challenges like finding specific colors in your environment to earn points.",
  },
  {
    icon: Palette,
    title: "5 Color Modes",
    description: "Detect Pink, Green, Yellow, Blue, and White with precise HSV range matching.",
  },
]

const COLOR_SWATCHES = [
  { name: "Pink", color: "#FF00FF", bg: "bg-[#FF00FF]" },
  { name: "Green", color: "#00FF00", bg: "bg-[#00FF00]" },
  { name: "Yellow", color: "#FFFF00", bg: "bg-[#FFFF00]" },
  { name: "Blue", color: "#0066FF", bg: "bg-[#0066FF]" },
  { name: "White", color: "#FFFFFF", bg: "bg-[#FFFFFF]" },
]

export default function Dashboard({
  lastDetectedColor,
  colorHistory,
  score,
  onStartDetection,
  gamificationEnabled,
  currentChallenge,
}: DashboardProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Last Detected"
          value={lastDetectedColor || "None yet"}
          colorDot={lastDetectedColor}
        />
        <StatCard
          label="Colors Found"
          value={String(colorHistory.length)}
        />
        {gamificationEnabled && (
          <StatCard
            label="Score"
            value={String(score)}
          />
        )}
        {gamificationEnabled && currentChallenge && (
          <StatCard
            label="Current Challenge"
            value={currentChallenge}
            highlight
          />
        )}
      </div>

      {/* Start Detection */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 md:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--color-neon-cyan)_0%,transparent_60%)] opacity-5" />
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
              Ready to Detect Colors?
            </h2>
            <p className="text-muted-foreground text-lg max-w-lg leading-relaxed">
              Open your camera and start pointing at objects. The system will identify colors in real-time with precise bounding boxes.
            </p>
          </div>
          <button
            onClick={onStartDetection}
            className="shrink-0 px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20"
          >
            Start Detection
          </button>
        </div>
      </div>

      {/* Detectable Colors */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">Detectable Colors</h3>
        <div className="flex flex-wrap gap-3">
          {COLOR_SWATCHES.map((swatch) => (
            <div
              key={swatch.name}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card transition-all duration-200 hover:border-primary/30"
            >
              <div className={`w-8 h-8 rounded-lg ${swatch.bg} ring-2 ring-border`} />
              <span className="text-sm font-medium text-foreground">{swatch.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FEATURE_CARDS.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.title}
              className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-foreground">{card.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  colorDot,
  highlight,
}: {
  label: string
  value: string
  colorDot?: string | null
  highlight?: boolean
}) {
  const colorMap: Record<string, string> = {
    PINK: "#FF00FF",
    GREEN: "#00FF00",
    YELLOW: "#FFFF00",
    BLUE: "#0066FF",
    WHITE: "#FFFFFF",
  }

  return (
    <div
      className={`rounded-xl border p-5 transition-all duration-200 ${
        highlight ? "border-primary/40 bg-primary/5" : "border-border bg-card"
      }`}
    >
      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
      <div className="flex items-center gap-2">
        {colorDot && colorMap[colorDot] && (
          <div
            className="w-4 h-4 rounded-full ring-2 ring-border"
            style={{ backgroundColor: colorMap[colorDot] }}
          />
        )}
        <p className="text-xl font-bold text-foreground truncate">{value}</p>
      </div>
    </div>
  )
}
