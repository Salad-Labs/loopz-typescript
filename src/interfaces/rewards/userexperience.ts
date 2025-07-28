import { Achievement } from "./achievement"
import { PerkReward } from "./perkreward"
import { RewardEvent } from "./rewardevent"
import { UserStatistics } from "./userstatistics"

export interface UserExperience {
  userId: string
  walletAddress?: string
  totalExperience: number
  currentLevelXP: number
  level: number
  nextLevelXP: number
  rank?: number // posizione nella classifica globale
  achievements: Achievement[]
  unlockedPerks: PerkReward[]
  rewardHistory: RewardEvent[]
  statistics: UserStatistics
}
