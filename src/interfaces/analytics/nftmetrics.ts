import { NFTCollection } from "./nftcollection"

export interface NFTMetrics {
  // Portfolio
  nftsOwned: number
  portfolioValueUSD: number
  collections: number

  // Trading
  nftsBought: number
  nftsSold: number
  totalSpentUSD: number
  totalEarnedUSD: number
  profitLoss: number

  // Collezioni top
  topCollections: NFTCollection[]

  // Attività
  mintsParticipated: number
  bluechipHoldings: number
}
