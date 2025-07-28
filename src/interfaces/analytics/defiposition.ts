export interface DeFiPosition {
  protocol: string
  type: "lending" | "borrowing" | "liquidity" | "staking" | "farming"
  valueUSD: number
  apy?: number
  health?: number
  openedAt: Date
}
