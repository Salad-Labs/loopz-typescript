import { AchievementData } from "./achievementdata"
import { BadgeData } from "./badgedata"
import { ReputationData } from "./reputationdata"
import { UserStats } from "./userstats"

export interface SoulBoundTokenMetadata {
  userId: string
  walletAddress: string
  level: number
  experience: number
  achievements: AchievementData[]
  stats: UserStats
  badges: BadgeData[]
  reputation: ReputationData
  lastUpdated: number
  customData?: Record<string, any>
}
