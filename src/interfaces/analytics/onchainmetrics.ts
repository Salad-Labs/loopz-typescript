import { ContractInteraction } from "./contractinteraction"
import { NetworkStats } from "./networkstats"
import { TokenVolume } from "./tokenvolume"

export interface OnChainMetrics {
  // Transazioni
  totalTransactions: number
  successfulTransactions: number
  failedTransactions: number

  // Volume
  totalVolumeUSD: number
  totalVolumeETH: number
  volumeByToken: TokenVolume[]

  // Gas
  gasSpent: bigint
  gasSpentUSD: number
  averageGasPrice: bigint

  // Contratti
  uniqueContractsInteracted: number
  contractInteractions: ContractInteraction[]
  contractsDeployed: number

  // Timeline
  firstTransactionDate: Date
  lastTransactionDate: Date
  activeDays: number
  longestInactivePeriod: number // giorni

  // Network
  networksUsed: NetworkStats[]
  bridgeTransactions: number
  crossChainVolume: number
}
