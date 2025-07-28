import { MultiplierCondition } from "./multipliercondition"

export interface ExperienceMultiplier {
  id: string
  name: string
  multiplier: number
  condition: MultiplierCondition
  duration?: number
  stackable: boolean
}
