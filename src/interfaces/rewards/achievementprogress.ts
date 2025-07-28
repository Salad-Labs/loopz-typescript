import { RequirementProgress } from "./requirementprogress"

export interface AchievementProgress {
  achievementId: string
  userId: string
  requirements: RequirementProgress[]
  startedAt: number
  lastUpdated: number
  completed: boolean
  claimedRewards: boolean
}
