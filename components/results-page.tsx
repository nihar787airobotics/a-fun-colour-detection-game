"use client"

import { Trash2 } from "lucide-react"

interface ColorHistoryEntry {
  color: string
  name: string
  timestamp: Date
}

interface ResultsPageProps {
  colorHistory: ColorHistoryEntry[]
  score: number
  onClearHistory: () => void
  gamificationEnabled: boolean
}

export default function ResultsPage({ colorHistory, score, onClearHistory, gamificationEnabled }: ResultsPageProps) {
  const colorCounts = colorHistory.reduce<Record<string, number>>((acc, entry) => {
    acc[entry.name] = (acc[entry.name] || 0) + 1
    return acc
  }, {})

  const colorMap: Record<string, string> = {
    PINK: "#FF00FF",
    GREEN: "#00FF00",
    YELLOW: "#FFFF00",
    BLUE: "#0066FF",
    WHITE: "#FFFFFF",
  }

  const sortedColors = Object.entries(colorCounts).sort((a, b) => b[1] - a[1])
  const maxCount = sortedColors.length > 0 ? sortedColors[0][1] : 1

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Detection Results</h2>
          <p className="text-muted-foreground mt-1">
            {"Your color detection history and statistics"}
          </p>
        </div>
        {colorHistory.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-all"
          >
            <Trash2 className="h-4 w-4" />
            Clear History
          </button>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Total Detections</p>
          <p className="text-3xl font-bold text-foreground mt-2">{colorHistory.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Unique Colors</p>
          <p className="text-3xl font-bold text-foreground mt-2">{Object.keys(colorCounts).length}</p>
        </div>
        {gamificationEnabled && (
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
            <p className="text-xs uppercase tracking-wider text-primary">Total Score</p>
            <p className="text-3xl font-bold text-primary mt-2">{score}</p>
          </div>
        )}
      </div>

      {/* Color Distribution */}
      {sortedColors.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Color Distribution</h3>
          <div className="space-y-3">
            {sortedColors.map(([name, count]) => (
              <div key={name} className="flex items-center gap-4">
                <div
                  className="w-8 h-8 rounded-lg shrink-0 ring-2 ring-border"
                  style={{ backgroundColor: colorMap[name] || "#888" }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{name}</span>
                    <span className="text-xs text-muted-foreground">{count} detections</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(count / maxCount) * 100}%`,
                        backgroundColor: colorMap[name] || "#888",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Table */}
      {colorHistory.length > 0 ? (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Detection History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    Color
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {colorHistory
                  .slice()
                  .reverse()
                  .slice(0, 50)
                  .map((entry, idx) => (
                    <tr key={idx} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                      <td className="px-6 py-3">
                        <div
                          className="w-6 h-6 rounded-md ring-2 ring-border"
                          style={{ backgroundColor: entry.color }}
                        />
                      </td>
                      <td className="px-6 py-3 text-sm font-medium text-foreground">{entry.name}</td>
                      <td className="px-6 py-3 text-sm text-muted-foreground">
                        {entry.timestamp.toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-muted-foreground">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-lg font-medium text-foreground">No detections yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Start a detection session to see your color history here.
          </p>
        </div>
      )}
    </div>
  )
}
