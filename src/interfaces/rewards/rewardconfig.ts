import { Achievement } from "./achievement"
import { LevelFormula } from "./levelformula"

export interface RewardConfig {
  experienceMultiplier: number
  levelFormula: LevelFormula
  achievementDefinitions: Achievement[]
  rewardDistributionStrategy: "instant" | "claimable" | "vested"
  trackOnChainEvents: boolean
  trackOffChainEvents: boolean
}
