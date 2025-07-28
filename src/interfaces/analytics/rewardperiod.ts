export interface RewardPeriod {
  period: "daily" | "weekly" | "monthly"
  date: Date
  experienceEarned: number
  rewardsCount: number
  valueUSD: number
}
