import { Achievement } from "./achievement"
import { RewardAction } from "./rewardaction"

export interface RewardEvent {
  id: string
  timestamp: number
  userId: string
  action: RewardAction
  experience: number
  achievements?: Achievement[]
  transactionHash?: string
  blockNumber?: number
  metadata?: Record<string, any>
  status: "pending" | "confirmed" | "failed"
}
