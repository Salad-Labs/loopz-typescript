import { tierMultipliers } from "src/constants/rewards/tiermultipliers"
import { Achievement } from "src/interfaces/rewards"

export function calculateAchievementXP(achievement: Achievement): number {
  const baseXP = achievement.rewards.experience
  const tierMultiplier = tierMultipliers[achievement.tier]
  return Math.floor(baseXP * tierMultiplier)
}
