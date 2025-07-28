import { RequirementType } from "src/interfaces/rewards/requirementtype"

export interface AchievementRequirement {
  type: RequirementType
  value: number
  current?: number
  metadata?: Record<string, any>
}
