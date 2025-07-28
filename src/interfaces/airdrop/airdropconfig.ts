import { EligibilityCriteria } from "./eligibilitycriteria"
import { MerkleTreeData } from "./merkletreedata"

export interface AirdropConfig {
  tokenAddress: string
  totalAmount: bigint
  distributionStrategy: "equal" | "weighted" | "custom" | "tiered"
  eligibilityCriteria: EligibilityCriteria[]
  antiSybilEnabled: boolean
  startTime: number
  endTime: number
  merkleRoot: MerkleTreeData
  metadata?: any
  maxParticipants: number
  claimDeadline: number
}
