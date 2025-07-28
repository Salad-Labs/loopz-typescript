import { RewardCategory } from "./rewardcategory"
import { RewardPeriod } from "./rewardperiod"

export interface RewardMetrics {
  totalExperienceEarned: number
  currentLevel: number
  achievementsUnlocked: number
  totalRewardsValueUSD: number

  // Dettagli temporali
  rewardsByPeriod: RewardPeriod[]
  streakDays: number
  bestStreak: number

  // Categorie
  rewardsByCategory: RewardCategory[]
  favoriteAction?: string

  // Ranking
  globalRank?: number
  percentileRank?: number
}
