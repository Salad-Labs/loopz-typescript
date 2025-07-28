import { DeFiPosition } from "./defiposition"

export interface DeFiMetrics {
  // Posizioni
  totalValueLocked: number
  activePositions: DeFiPosition[]
  historicalYield: number

  // Protocolli
  protocolsUsed: string[]
  favoriteProtocol?: string

  // Attività
  totalSwaps: number
  totalLiquidityProvided: number
  totalBorrowed: number
  totalLent: number

  // Performance
  impermanentLoss: number
  realizedPnL: number
  unrealizedPnL: number
}
