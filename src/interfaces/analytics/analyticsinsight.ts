export interface AnalyticsInsight {
  type: "achievement" | "warning" | "opportunity" | "trend"
  title: string
  description: string
  impact: "low" | "medium" | "high"
  actionable: boolean
  action?: string
}
