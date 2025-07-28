import { AirdropConfig } from "./airdropconfig"

export interface AirdropInfo {
  id: string
  config: AirdropConfig
  status: "pending" | "active" | "completed" | "cancelled"
  totalClaimed: bigint
  claimCount: number
  recipients: number
  createdAt: number
  contractAddress?: string
}
