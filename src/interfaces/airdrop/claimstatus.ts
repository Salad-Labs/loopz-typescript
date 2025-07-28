export interface ClaimStatus {
  claimed: boolean
  amount: bigint
  timestamp?: number
  transactionHash?: string
}
