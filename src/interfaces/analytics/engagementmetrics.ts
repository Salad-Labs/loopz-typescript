export interface EngagementMetrics {
  // Frequenza
  dailyActiveRate: number // ultimi 30 giorni
  weeklyActiveRate: number // ultime 12 settimane
  monthlyActiveRate: number // ultimi 12 mesi

  // Sessioni
  totalSessions: number
  averageSessionDuration: number // minuti
  averageActionsPerSession: number

  // Retention
  retentionRate30d: number
  churnRisk: "low" | "medium" | "high"
  lastActiveHoursAgo: number

  // Pattern comportamentali
  peakActivityHours: number[] // ore del giorno [0-23]
  peakActivityDays: string[] // giorni settimana
  preferredGasSettings: "slow" | "standard" | "fast"
}
