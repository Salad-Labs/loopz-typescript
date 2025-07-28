export interface UserStatistics {
  totalActions: number
  favoriteAction?: string
  streak: number
  bestStreak: number
  totalRewardsEarned: bigint
  joinedAt: number
  lastActiveAt: number
}
