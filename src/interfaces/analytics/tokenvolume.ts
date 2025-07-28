export interface TokenVolume {
  tokenAddress: string
  symbol: string
  decimals: number
  volume: bigint
  volumeUSD: number
  transactionCount: number
}
