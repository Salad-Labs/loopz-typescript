import { AchievementCategory } from "./achievementcategory"
import { AchievementRequirement } from "./achievementrequirement"
import { AchievementReward } from "./achievementreward"
import { AchievementTier } from "./achievementtier"

export interface Achievement {
  id: string
  name: string
  description: string
  icon?: string
  category: AchievementCategory
  tier: AchievementTier
  requirements: AchievementRequirement[]
  rewards: AchievementReward
  unlockedAt?: number
  progress?: number
  metadata?: Record<string, any>
}
