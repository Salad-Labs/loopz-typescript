import { BadgeReward } from "./badgereward"
import { PerkReward } from "./perkreward"
import { TokenReward } from "./tokenreward"

export interface AchievementReward {
  experience: number
  badge?: BadgeReward
  tokens?: TokenReward[]
  perks?: PerkReward[]
  title?: string
}
