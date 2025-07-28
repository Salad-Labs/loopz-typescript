export interface NetworkStats {
  chainId: number
  name: string
  transactionCount: number
  volumeUSD: number
  gasSpent: bigint
  lastActivity: Date
}
