import { AnalyticsInsight } from "./analyticsinsight"
import { AnalyticsSummary } from "./analyticssummary"
import { UserAnalytics } from "./useranalytics"

export interface UserAnalyticsReport {
  analytics: UserAnalytics
  summary: AnalyticsSummary
  insights: AnalyticsInsight[]
  recommendations: string[]
  generatedAt: Date
}
