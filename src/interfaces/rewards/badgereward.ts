import { AchievementTier } from "./achievementtier"

export interface BadgeReward {
  id: string
  name: string
  imageUrl: string
  rarity: AchievementTier
}
