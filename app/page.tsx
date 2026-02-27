"use client"

import { useState, useCallback, useRef } from "react"
import AnimatedShaderHero from "@/components/animated-shader-hero"
import NavBar, { type NavPage } from "@/components/nav-bar"
import Dashboard from "@/components/dashboard"
import ColorDetection from "@/components/color-detection"
import ResultsPage from "@/components/results-page"
import SettingsPage from "@/components/settings-page"

const CHALLENGES = [
  "Find something PINK",
  "Find something GREEN",
  "Find something YELLOW",
  "Find something BLUE",
  "Find something WHITE",
]

interface ColorHistoryEntry {
  color: string
  name: string
  timestamp: Date
}

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState<NavPage>("home")
  const [showHero, setShowHero] = useState(true)
  const [showCamera, setShowCamera] = useState(false)
  const [colorHistory, setColorHistory] = useState<ColorHistoryEntry[]>([])
  const [lastDetectedColor, setLastDetectedColor] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [gamificationEnabled, setGamificationEnabled] = useState(true)
  const [currentChallenge, setCurrentChallenge] = useState<string>(CHALLENGES[3])
  const lastReportedRef = useRef<string>("")
  const lastReportedTimeRef = useRef<number>(0)

  const handleStartGame = useCallback(() => {
    setShowHero(false)
    setCurrentPage("home")
  }, [])

  const handleLearnMore = useCallback(() => {
    setShowHero(false)
    setCurrentPage("home")
  }, [])

  const handleStartDetection = useCallback(() => {
    setShowCamera(true)
  }, [])

  const handleColorDetected = useCallback((color: string, name: string) => {
    const now = Date.now()
    if (lastReportedRef.current === name && now - lastReportedTimeRef.current < 2000) return
    lastReportedRef.current = name
    lastReportedTimeRef.current = now

    setLastDetectedColor(name)
    setColorHistory((prev) => [...prev, { color, name, timestamp: new Date() }])
  }, [])

  const handleChallengeComplete = useCallback(() => {
    setScore((prev) => prev + 10)
    const remaining = CHALLENGES.filter((c) => c !== currentChallenge)
    setCurrentChallenge(remaining[Math.floor(Math.random() * remaining.length)])
  }, [currentChallenge])

  const handleClearHistory = useCallback(() => {
    setColorHistory([])
    setLastDetectedColor(null)
    setScore(0)
  }, [])

  const handleToggleGamification = useCallback(() => {
    setGamificationEnabled((prev) => !prev)
  }, [])

  if (showHero) {
    return (
      <AnimatedShaderHero
        headline={{ line1: "Detect Colors", line2: "In Real Time" }}
        subtitle="Point your camera at the world and watch as AI-powered vision identifies colors instantly. Play challenges, earn points, and explore the spectrum around you."
        onStartGame={handleStartGame}
        onLearnMore={handleLearnMore}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar currentPage={currentPage} onNavigate={setCurrentPage} />

      <main>
        {currentPage === "home" && (
          <Dashboard
            lastDetectedColor={lastDetectedColor}
            colorHistory={colorHistory}
            score={score}
            onStartDetection={handleStartDetection}
            gamificationEnabled={gamificationEnabled}
            currentChallenge={gamificationEnabled ? currentChallenge : null}
          />
        )}

        {currentPage === "play" && (
          <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8">
            <div className="rounded-xl border border-border bg-card p-8 md:p-12 text-center space-y-6">
              <div className="mx-auto w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-primary">
                  <path
                    d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-foreground text-balance">Start a Detection Session</h2>
                <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Open your camera and point it at colorful objects. The system will identify colors in real-time and draw bounding boxes around detected regions.
                </p>
              </div>
              {gamificationEnabled && currentChallenge && (
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20">
                  <span className="text-sm font-medium text-primary">Challenge: {currentChallenge}</span>
                </div>
              )}
              <button
                onClick={handleStartDetection}
                className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20"
              >
                Open Camera
              </button>
            </div>
          </div>
        )}

        {currentPage === "results" && (
          <ResultsPage
            colorHistory={colorHistory}
            score={score}
            onClearHistory={handleClearHistory}
            gamificationEnabled={gamificationEnabled}
          />
        )}

        {currentPage === "settings" && (
          <SettingsPage
            gamificationEnabled={gamificationEnabled}
            onToggleGamification={handleToggleGamification}
          />
        )}
      </main>

      {showCamera && (
        <ColorDetection
          onColorDetected={handleColorDetected}
          onClose={() => setShowCamera(false)}
          gamificationEnabled={gamificationEnabled}
          currentChallenge={gamificationEnabled ? currentChallenge : null}
          onChallengeComplete={handleChallengeComplete}
          score={score}
        />
      )}
    </div>
  )
}
