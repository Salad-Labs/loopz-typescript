export interface EligibilityCriteria {
  type:
    | "minBalance"
    | "minTransactions"
    | "soulBoundToken"
    | "snapshot"
    | "whitelist"
    | "custom"
  value: any
  contractAddress?: string
  chainId?: number
  weight?: number // Per distribuzione weighted
}
