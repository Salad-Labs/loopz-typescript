import { RequirementType } from "src/interfaces/rewards/requirementtype"

export interface RequirementProgress {
  type: RequirementType
  current: number
  target: number
  completed: boolean
  lastUpdated: number
}
