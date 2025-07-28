export interface LeaderboardEntry {
  rank: number
  userId: string
  walletAddress?: string
  username?: string
  avatar?: string
  level: number
  totalExperience: number
  achievementCount: number
  change: number // cambio di posizione rispetto al periodo precedente
}
