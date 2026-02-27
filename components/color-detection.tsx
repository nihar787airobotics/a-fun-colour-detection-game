"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { Camera, X, RotateCcw, Trophy } from "lucide-react"

interface ColorRange {
  name: string
  lower: [number, number, number]
  upper: [number, number, number]
  boxColor: string
  displayColor: string
}

const COLORS: ColorRange[] = [
  { name: "PINK", lower: [140, 40, 40], upper: [165, 255, 255], boxColor: "#FF00FF", displayColor: "#FF00FF" },
  { name: "GREEN", lower: [35, 40, 40], upper: [85, 255, 255], boxColor: "#00FF00", displayColor: "#00FF00" },
  { name: "YELLOW", lower: [15, 40, 40], upper: [40, 255, 255], boxColor: "#FFFF00", displayColor: "#FFFF00" },
  { name: "BLUE", lower: [100, 40, 40], upper: [130, 255, 255], boxColor: "#0066FF", displayColor: "#0066FF" },
  { name: "WHITE", lower: [0, 0, 200], upper: [179, 40, 255], boxColor: "#FFFFFF", displayColor: "#FFFFFF" },
]

const CHALLENGES = [
  "Find something PINK",
  "Find something GREEN",
  "Find something YELLOW",
  "Find something BLUE",
  "Find something WHITE",
]

interface DetectionResult {
  color: string
  name: string
  x: number
  y: number
  w: number
  h: number
}

interface ColorDetectionProps {
  onColorDetected: (color: string, name: string) => void
  onClose: () => void
  gamificationEnabled: boolean
  currentChallenge: string | null
  onChallengeComplete: () => void
  score: number
}

function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  const s = max === 0 ? 0 : d / max
  const v = max

  if (d !== 0) {
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return [h * 179, s * 255, v * 255]
}

export default function ColorDetection({
  onColorDetected,
  onClose,
  gamificationEnabled,
  currentChallenge,
  onChallengeComplete,
  score,
}: ColorDetectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animFrameRef = useRef<number>(0)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [detections, setDetections] = useState<DetectionResult[]>([])
  const [dominantColor, setDominantColor] = useState<string | null>(null)

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setIsStreaming(true)
        setError(null)
      }
    } catch {
      setError("Camera access denied. Please allow camera permissions and try again.")
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    setIsStreaming(false)
  }, [])

  const detectColors = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !overlayCanvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const overlay = overlayCanvasRef.current
    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    const oCtx = overlay.getContext("2d")
    if (!ctx || !oCtx) return

    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    overlay.width = canvas.width
    overlay.height = canvas.height

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data

    oCtx.clearRect(0, 0, overlay.width, overlay.height)

    const blockSize = 8
    const results: DetectionResult[] = []

    for (const colorDef of COLORS) {
      const colorPixels: { x: number; y: number }[] = []

      for (let y = 0; y < canvas.height; y += blockSize) {
        for (let x = 0; x < canvas.width; x += blockSize) {
          const idx = (y * canvas.width + x) * 4
          const r = pixels[idx]
          const g = pixels[idx + 1]
          const b = pixels[idx + 2]

          const [h, s, v] = rgbToHsv(r, g, b)

          if (
            h >= colorDef.lower[0] &&
            h <= colorDef.upper[0] &&
            s >= colorDef.lower[1] &&
            s <= colorDef.upper[1] &&
            v >= colorDef.lower[2] &&
            v <= colorDef.upper[2]
          ) {
            colorPixels.push({ x, y })
          }
        }
      }

      if (colorPixels.length > 15) {
        let minX = canvas.width,
          minY = canvas.height,
          maxX = 0,
          maxY = 0
        for (const p of colorPixels) {
          if (p.x < minX) minX = p.x
          if (p.y < minY) minY = p.y
          if (p.x > maxX) maxX = p.x
          if (p.y > maxY) maxY = p.y
        }

        const w = maxX - minX
        const h = maxY - minY

        if (w > 30 && h > 30) {
          oCtx.strokeStyle = colorDef.boxColor
          oCtx.lineWidth = 3
          oCtx.strokeRect(minX, minY, w, h)

          oCtx.fillStyle = colorDef.boxColor
          oCtx.font = "bold 16px Geist, sans-serif"
          const textW = oCtx.measureText(colorDef.name).width
          oCtx.fillRect(minX, minY - 26, textW + 12, 26)
          oCtx.fillStyle = colorDef.name === "WHITE" || colorDef.name === "YELLOW" ? "#000000" : "#FFFFFF"
          oCtx.fillText(colorDef.name, minX + 6, minY - 8)

          results.push({
            color: colorDef.displayColor,
            name: colorDef.name,
            x: minX,
            y: minY,
            w,
            h,
          })
        }
      }
    }

    setDetections(results)

    if (results.length > 0) {
      const largest = results.reduce((a, b) => (a.w * a.h > b.w * b.h ? a : b))
      setDominantColor(largest.name)
      onColorDetected(largest.color, largest.name)

      if (gamificationEnabled && currentChallenge) {
        const challengeColor = currentChallenge.replace("Find something ", "").trim()
        if (largest.name === challengeColor) {
          onChallengeComplete()
        }
      }
    }

    animFrameRef.current = requestAnimationFrame(detectColors)
  }, [onColorDetected, gamificationEnabled, currentChallenge, onChallengeComplete])

  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [startCamera, stopCamera])

  useEffect(() => {
    if (isStreaming) {
      const video = videoRef.current
      if (video) {
        const onPlay = () => {
          detectColors()
        }
        video.addEventListener("playing", onPlay)
        return () => video.removeEventListener("playing", onPlay)
      }
    }
  }, [isStreaming, detectColors])

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Camera className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground">Live Detection</span>
        </div>
        <div className="flex items-center gap-3">
          {gamificationEnabled && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[color:var(--color-neon-yellow)]/10 border border-[color:var(--color-neon-yellow)]/20">
              <Trophy className="h-4 w-4 text-[color:var(--color-neon-yellow)]" />
              <span className="text-sm font-bold text-[color:var(--color-neon-yellow)]">{score}</span>
            </div>
          )}
          <button
            onClick={() => {
              stopCamera()
              onClose()
            }}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Close camera"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Challenge Bar */}
      {gamificationEnabled && currentChallenge && (
        <div className="px-4 py-3 bg-primary/5 border-b border-primary/10 text-center">
          <p className="text-sm font-medium text-primary">{currentChallenge}</p>
        </div>
      )}

      {/* Camera View */}
      <div className="flex-1 relative overflow-hidden bg-background">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8">
            <div className="p-4 rounded-full bg-destructive/10">
              <X className="h-8 w-8 text-destructive" />
            </div>
            <p className="text-center text-muted-foreground">{error}</p>
            <button
              onClick={startCamera}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium transition-all hover:bg-primary/90"
            >
              <RotateCcw className="h-4 w-4" />
              Retry
            </button>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            <video
              ref={videoRef}
              className="max-w-full max-h-full object-contain"
              playsInline
              muted
              autoPlay
            />
            <canvas ref={canvasRef} className="hidden" />
            <canvas
              ref={overlayCanvasRef}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-full max-h-full object-contain pointer-events-none"
            />
          </div>
        )}
      </div>

      {/* Bottom panel */}
      <div className="border-t border-border bg-card/80 backdrop-blur-xl px-4 py-4">
        <div className="flex items-center gap-4 overflow-x-auto">
          {dominantColor && (
            <div className="flex items-center gap-2 shrink-0">
              <div
                className="w-6 h-6 rounded-full ring-2 ring-border"
                style={{
                  backgroundColor:
                    COLORS.find((c) => c.name === dominantColor)?.displayColor || "#888",
                }}
              />
              <span className="text-sm font-semibold text-foreground">{dominantColor}</span>
            </div>
          )}
          <div className="h-6 w-px bg-border shrink-0" />
          <div className="flex items-center gap-2 flex-wrap">
            {detections.map((d, i) => (
              <div
                key={`${d.name}-${i}`}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-border bg-secondary"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: d.color }}
                />
                <span className="text-secondary-foreground">{d.name}</span>
              </div>
            ))}
            {detections.length === 0 && (
              <span className="text-xs text-muted-foreground">Point camera at a colored object...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
