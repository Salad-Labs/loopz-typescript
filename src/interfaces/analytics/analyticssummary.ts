export interface AnalyticsSummary {
  totalValueManaged: number
  netWorth: number
  monthlyActive: boolean
  topCategory: string
  userType: "casual" | "active" | "power" | "whale"
  accountAge: number // giorni
}
