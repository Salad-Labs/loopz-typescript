export interface AnalyticsConfig {
  // Data sources
  rpcEndpoints: Record<number, string> // chainId -> endpoint
  apiKeys?: {
    etherscan?: string
    covalent?: string
    moralis?: string
    dune?: string
  }

  // Settings
  cacheEnabled: boolean
  cacheDuration: number // secondi
  realTimeTracking: boolean

  // Filtri
  minTransactionValue?: number // USD
  excludeContracts?: string[]

  // Privacy
  anonymizeData: boolean
  dataRetentionDays: number
}
