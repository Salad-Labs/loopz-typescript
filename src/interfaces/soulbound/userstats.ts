export interface UserStats {
  transactionsCount: number
  volumeTraded: bigint
  daysActive: number
  protocolsUsed: string[]
  nftsOwned: number
  defiPositions: number
  socialScore: number
  customStats?: Record<string, any>
}
