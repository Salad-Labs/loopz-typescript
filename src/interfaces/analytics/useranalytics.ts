import { DeFiMetrics } from "./defimetrics"
import { EngagementMetrics } from "./engagementmetrics"
import { NFTMetrics } from "./nftmetrics"
import { OnChainMetrics } from "./onchainmetrics"
import { RewardMetrics } from "./rewardmetrics"
import { RiskMetrics } from "./riskmetrics"
import { SocialMetrics } from "./socialmetrics"

export interface UserAnalytics {
  address: string
  userId?: string
  onChainMetrics: OnChainMetrics
  rewardMetrics: RewardMetrics
  engagementMetrics: EngagementMetrics
  defiMetrics: DeFiMetrics
  nftMetrics: NFTMetrics
  socialMetrics: SocialMetrics
  riskMetrics: RiskMetrics
  timestamp: number
}
