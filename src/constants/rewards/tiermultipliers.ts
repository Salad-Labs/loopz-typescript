import { AchievementTier } from "src/interfaces/rewards"

export const tierMultipliers: Record<AchievementTier, number> = {
  [AchievementTier.BRONZE]: 1,
  [AchievementTier.SILVER]: 1.5,
  [AchievementTier.GOLD]: 2,
  [AchievementTier.PLATINUM]: 3,
  [AchievementTier.DIAMOND]: 5,
}
