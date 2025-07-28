export interface AnalyticsEvent {
  userId: string
  address: string
  eventType: "transaction" | "interaction" | "achievement" | "custom"
  category: string
  action: string
  label?: string
  value?: number
  metadata?: Record<string, any>
  timestamp: number
}
