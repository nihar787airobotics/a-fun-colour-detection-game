"use client"

import { Monitor, Gamepad2, ShieldCheck } from "lucide-react"

interface SettingsPageProps {
  gamificationEnabled: boolean
  onToggleGamification: () => void
}

export default function SettingsPage({ gamificationEnabled, onToggleGamification }: SettingsPageProps) {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground mt-1">Customize your detection experience</p>
      </div>

      <div className="space-y-4">
        {/* Appearance */}
        <SettingSection
          icon={Monitor}
          title="Appearance"
          description="The app uses a dark theme optimized for color detection accuracy."
        >
          <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-secondary">
            <div className="w-8 h-8 rounded-lg bg-background border border-border" />
            <div>
              <p className="text-sm font-medium text-foreground">Dark Mode</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </div>
        </SettingSection>

        {/* Gamification */}
        <SettingSection
          icon={Gamepad2}
          title="Gamification"
          description="Enable challenges and scoring for a more interactive experience."
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Enable Challenges</p>
              <p className="text-xs text-muted-foreground">
                Get random color-finding challenges and earn points
              </p>
            </div>
            <button
              onClick={onToggleGamification}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                gamificationEnabled ? "border-primary bg-primary" : "border-border bg-secondary"
              }`}
              role="switch"
              aria-checked={gamificationEnabled}
            >
              <span
                className={`pointer-events-none block h-5.5 w-5.5 rounded-full shadow-lg ring-0 transition-transform duration-200 ${
                  gamificationEnabled
                    ? "translate-x-5 bg-primary-foreground"
                    : "translate-x-0 bg-muted-foreground"
                }`}
                style={{ width: 22, height: 22 }}
              />
            </button>
          </div>
        </SettingSection>

        {/* Camera */}
        <SettingSection
          icon={ShieldCheck}
          title="Camera Permissions"
          description="Camera access is required for color detection. Permissions are requested when you start a detection session."
        >
          <div className="p-3 rounded-lg border border-border bg-secondary">
            <p className="text-xs text-muted-foreground leading-relaxed">
              ChromaDetect processes all video frames locally in your browser. No images or video are sent to any server. Your camera feed never leaves your device.
            </p>
          </div>
        </SettingSection>

        {/* About */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">About ChromaDetect</h3>
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              ChromaDetect is a web-based color detection game that uses your device camera to identify colors in real-time. Inspired by OpenCV color detection techniques, it uses HSV color space analysis to accurately detect Pink, Green, Yellow, Blue, and White objects.
            </p>
            <p>
              Built with Next.js, WebGL shaders, and the Canvas API. Color detection runs entirely client-side using JavaScript implementations of computer vision algorithms.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Version 1.0.0</span>
            <span className="text-border">|</span>
            <span>Powered by HSV Color Analysis</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-primary/10 p-2.5">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </div>
  )
}
