import { ethers } from "ethers"
import { EventEmitter } from "events"
import { ChainActivityTracker } from "./chainactivitytracker"
import {
  UserAnalytics,
  UserAnalyticsReport,
  AnalyticsConfig,
  OnChainMetrics,
  RewardMetrics,
  EngagementMetrics,
  DeFiMetrics,
  NFTMetrics,
  SocialMetrics,
  TimeFrame,
  AnalyticsFilter,
  AnalyticsEvent,
  AnalyticsInsight,
  UserBenchmark,
  AggregatedMetrics,
} from "../interfaces/analytics"
import { RiskMetrics } from "src/interfaces/analytics/riskmetrics"

/**
 * User Analytics - Sistema completo di analytics per utenti
 */
export class UserAnalyticsSystem extends EventEmitter {
  private chainTracker: ChainActivityTracker
  private config: AnalyticsConfig
  private analyticsCache: Map<string, UserAnalytics> = new Map()
  private eventQueue: AnalyticsEvent[] = []
  private processingInterval: NodeJS.Timeout

  constructor(config: AnalyticsConfig) {
    super()
    this.config = config
    this.chainTracker = new ChainActivityTracker(config)

    // Processa eventi periodicamente
    this.processingInterval = setInterval(() => {
      this.processEventQueue()
    }, 10000) // ogni 10 secondi
  }

  /**
   * Ottiene analytics complete per un utente
   */
  async getUserAnalytics(
    userAddress: string,
    options?: {
      useCache?: boolean
      filter?: AnalyticsFilter
    }
  ): Promise<UserAnalytics> {
    // Controlla cache
    if (options?.useCache && this.analyticsCache.has(userAddress)) {
      const cached = this.analyticsCache.get(userAddress)!
      if (Date.now() - cached.timestamp < this.config.cacheDuration * 1000) {
        return cached
      }
    }

    // Raccogli tutte le metriche
    const [
      onChainMetrics,
      rewardMetrics,
      engagementMetrics,
      defiMetrics,
      nftMetrics,
      socialMetrics,
      riskMetrics,
    ] = await Promise.all([
      this.getOnChainMetrics(userAddress, options?.filter),
      this.getRewardMetrics(userAddress),
      this.getEngagementMetrics(userAddress),
      this.getDeFiMetrics(userAddress),
      this.getNFTMetrics(userAddress),
      this.getSocialMetrics(userAddress),
      this.getRiskMetrics(userAddress),
    ])

    const analytics: UserAnalytics = {
      address: userAddress,
      onChainMetrics,
      rewardMetrics,
      engagementMetrics,
      defiMetrics,
      nftMetrics,
      socialMetrics,
      riskMetrics,
      timestamp: Date.now(),
    }

    // Salva in cache
    this.analyticsCache.set(userAddress, analytics)

    // Emetti evento
    this.emit("analyticsGenerated", analytics)

    return analytics
  }

  /**
   * Ottiene metriche on-chain
   */
  private async getOnChainMetrics(
    userAddress: string,
    filter?: AnalyticsFilter
  ): Promise<OnChainMetrics> {
    const chainIds =
      filter?.networks || Object.keys(this.config.rpcEndpoints).map(Number)
    return await this.chainTracker.trackAddress(userAddress, chainIds)
  }

  /**
   * Ottiene metriche reward
   */
  private async getRewardMetrics(userAddress: string): Promise<RewardMetrics> {
    // In produzione, query da RewardManager/database
    // Per demo, dati simulati
    return {
      totalExperienceEarned: 5420,
      currentLevel: 12,
      achievementsUnlocked: 18,
      totalRewardsValueUSD: 342.5,
      rewardsByPeriod: [
        {
          period: "daily",
          date: new Date(),
          experienceEarned: 250,
          rewardsCount: 5,
          valueUSD: 12.5,
        },
        {
          period: "weekly",
          date: new Date(),
          experienceEarned: 1200,
          rewardsCount: 23,
          valueUSD: 67.8,
        },
      ],
      streakDays: 7,
      bestStreak: 14,
      rewardsByCategory: [
        {
          category: "trading",
          count: 45,
          totalExperience: 2250,
          percentage: 41.5,
        },
        {
          category: "social",
          count: 28,
          totalExperience: 1400,
          percentage: 25.8,
        },
      ],
      favoriteAction: "trading",
      globalRank: 1247,
      percentileRank: 88.5,
    }
  }

  /**
   * Ottiene metriche engagement
   */
  private async getEngagementMetrics(
    userAddress: string
  ): Promise<EngagementMetrics> {
    // Calcola da eventi storici
    const events = await this.getRecentEvents(userAddress, 30) // ultimi 30 giorni

    const dailyActive = this.calculateDailyActiveRate(events, 30)
    const weeklyActive = this.calculateWeeklyActiveRate(events, 12)

    return {
      dailyActiveRate: dailyActive,
      weeklyActiveRate: weeklyActive,
      monthlyActiveRate: 0.85,
      totalSessions: 142,
      averageSessionDuration: 18.5,
      averageActionsPerSession: 4.2,
      retentionRate30d: 0.76,
      churnRisk: this.calculateChurnRisk(dailyActive, weeklyActive),
      lastActiveHoursAgo: this.getHoursSinceLastActivity(events),
      peakActivityHours: [14, 15, 20, 21], // 2-3 PM, 8-9 PM
      peakActivityDays: ["Monday", "Wednesday", "Friday"],
      preferredGasSettings: "standard",
    }
  }

  /**
   * Ottiene metriche DeFi
   */
  private async getDeFiMetrics(userAddress: string): Promise<DeFiMetrics> {
    // In produzione, query da protocolli DeFi
    return {
      totalValueLocked: 45230.5,
      activePositions: [
        {
          protocol: "Aave",
          type: "lending",
          valueUSD: 15000,
          apy: 3.2,
          health: 1.8,
          openedAt: new Date("2024-01-15"),
        },
        {
          protocol: "Uniswap V3",
          type: "liquidity",
          valueUSD: 30230.5,
          apy: 12.5,
          openedAt: new Date("2024-02-01"),
        },
      ],
      historicalYield: 2847.3,
      protocolsUsed: ["Aave", "Uniswap", "Compound", "Curve"],
      favoriteProtocol: "Uniswap",
      totalSwaps: 287,
      totalLiquidityProvided: 85420,
      totalBorrowed: 12000,
      totalLent: 45000,
      impermanentLoss: -342.1,
      realizedPnL: 2505.2,
      unrealizedPnL: 1823.45,
    }
  }

  /**
   * Ottiene metriche NFT
   */
  private async getNFTMetrics(userAddress: string): Promise<NFTMetrics> {
    return {
      nftsOwned: 23,
      portfolioValueUSD: 8420.0,
      collections: 8,
      nftsBought: 31,
      nftsSold: 8,
      totalSpentUSD: 12500,
      totalEarnedUSD: 15800,
      profitLoss: 3300,
      topCollections: [
        {
          address: "0x...",
          name: "Bored Apes",
          holdings: 2,
          floorPrice: 25.5,
          totalValue: 51.0,
        },
      ],
      mintsParticipated: 12,
      bluechipHoldings: 3,
    }
  }

  /**
   * Ottiene metriche social
   */
  private async getSocialMetrics(userAddress: string): Promise<SocialMetrics> {
    return {
      followers: 342,
      following: 128,
      reputationScore: 720,
      trustLevel: "high",
      endorsements: 45,
      daoParticipation: 5,
      proposalsCreated: 3,
      votesCount: 67,
      communitiesJoined: ["DeFi DAO", "Uniswap Governance", "Aave Community"],
      contributionScore: 82,
    }
  }

  /**
   * Ottiene metriche di rischio
   */
  private async getRiskMetrics(userAddress: string): Promise<RiskMetrics> {
    const onChainData = await this.getOnChainMetrics(userAddress)
    const riskFactors = this.analyzeRiskFactors(onChainData)

    return {
      riskScore: riskFactors.score,
      riskLevel: this.getRiskLevel(riskFactors.score),
      suspiciousActivity: riskFactors.suspicious,
      highRiskInteractions: riskFactors.highRiskCount,
      exploitExposure: riskFactors.exploits,
      unusualPatterns: riskFactors.patterns,
      velocityScore: riskFactors.velocity,
      sanctionedInteractions: 0,
      mixerUsage: false,
      lastRiskAssessment: new Date(),
    }
  }

  /**
   * Genera report completo
   */
  async generateUserReport(userAddress: string): Promise<UserAnalyticsReport> {
    const analytics = await this.getUserAnalytics(userAddress)
    const insights = this.generateInsights(analytics)
    const recommendations = this.generateRecommendations(analytics, insights)

    const summary = {
      totalValueManaged:
        analytics.defiMetrics.totalValueLocked +
        analytics.nftMetrics.portfolioValueUSD,
      netWorth: this.calculateNetWorth(analytics),
      monthlyActive: analytics.engagementMetrics.monthlyActiveRate > 0.5,
      topCategory: this.getTopCategory(analytics),
      userType: this.getUserType(analytics),
      accountAge: this.getAccountAge(analytics.onChainMetrics),
    }

    return {
      analytics,
      summary,
      insights,
      recommendations,
      generatedAt: new Date(),
    }
  }

  /**
   * Genera insights
   */
  private generateInsights(analytics: UserAnalytics): AnalyticsInsight[] {
    const insights: AnalyticsInsight[] = []

    // Achievement insights
    if (analytics.rewardMetrics.streakDays >= 7) {
      insights.push({
        type: "achievement",
        title: "Active Streak!",
        description: `You've been active for ${analytics.rewardMetrics.streakDays} days straight`,
        impact: "medium",
        actionable: true,
        action: "Keep it up to unlock streak rewards!",
      })
    }

    // Risk warnings
    if (analytics.riskMetrics.riskLevel === "high") {
      insights.push({
        type: "warning",
        title: "High Risk Activity Detected",
        description: "Some of your recent interactions have elevated risk",
        impact: "high",
        actionable: true,
        action: "Review your recent transactions",
      })
    }

    // Opportunity insights
    if (analytics.defiMetrics.activePositions.length < 2) {
      insights.push({
        type: "opportunity",
        title: "Diversification Opportunity",
        description: "Consider diversifying your DeFi positions",
        impact: "medium",
        actionable: true,
        action: "Explore new protocols",
      })
    }

    // Trend insights
    if (analytics.onChainMetrics.totalVolumeUSD > 10000) {
      insights.push({
        type: "trend",
        title: "High Volume Trader",
        description: `You've traded over $${analytics.onChainMetrics.totalVolumeUSD.toLocaleString()}`,
        impact: "low",
        actionable: false,
      })
    }

    return insights
  }

  /**
   * Genera raccomandazioni
   */
  private generateRecommendations(
    analytics: UserAnalytics,
    insights: AnalyticsInsight[]
  ): string[] {
    const recommendations: string[] = []

    // Base su engagement
    if (analytics.engagementMetrics.churnRisk === "high") {
      recommendations.push(
        "Increase your activity to maintain your rewards multiplier"
      )
    }

    // Base su DeFi
    if (analytics.defiMetrics.impermanentLoss < -500) {
      recommendations.push(
        "Consider rebalancing your liquidity positions to minimize IL"
      )
    }

    // Base su NFT
    if (analytics.nftMetrics.profitLoss > 1000) {
      recommendations.push("Great NFT trading! Consider taking some profits")
    }

    // Base su risk
    if (analytics.riskMetrics.riskScore > 70) {
      recommendations.push("Review and audit your smart contract interactions")
    }

    return recommendations
  }

  /**
   * Confronta con benchmark
   */
  async compareWithBenchmark(userAddress: string): Promise<UserBenchmark[]> {
    const analytics = await this.getUserAnalytics(userAddress)

    // In produzione, confronterebbe con medie reali
    return [
      {
        metric: "Total Volume",
        userValue: analytics.onChainMetrics.totalVolumeUSD,
        average: 15000,
        median: 8000,
        percentile: 75,
        interpretation: "Above average trader",
      },
      {
        metric: "DeFi TVL",
        userValue: analytics.defiMetrics.totalValueLocked,
        average: 25000,
        median: 10000,
        percentile: 82,
        interpretation: "Strong DeFi participant",
      },
    ]
  }

  /**
   * Traccia evento custom
   */
  async trackCustomEvent(
    userId: string,
    eventName: string,
    properties: Record<string, any>
  ): Promise<void> {
    const event: AnalyticsEvent = {
      userId,
      address: userId, // assumendo che userId sia address
      eventType: "custom",
      category: "custom",
      action: eventName,
      value: properties.value,
      metadata: properties,
      timestamp: Date.now(),
    }

    this.eventQueue.push(event)

    // Se real-time tracking abilitato
    if (this.config.realTimeTracking) {
      await this.processEvent(event)
    }
  }

  /**
   * Ottiene aggregazioni
   */
  async getAggregatedMetrics(
    filter: AnalyticsFilter
  ): Promise<AggregatedMetrics[]> {
    // In produzione, query aggregate dal database
    const mockData: AggregatedMetrics[] = [
      {
        period: "2024-03-01",
        transactionCount: 1250,
        volumeUSD: 2500000,
        uniqueUsers: 342,
        gasSpentUSD: 12500,
        averageTransactionSize: 2000,
      },
    ]

    return mockData
  }

  /**
   * Helper functions
   */

  private calculateDailyActiveRate(
    events: AnalyticsEvent[],
    days: number
  ): number {
    const activeDays = new Set(
      events.map((e) => new Date(e.timestamp).toDateString())
    ).size

    return activeDays / days
  }

  private calculateWeeklyActiveRate(
    events: AnalyticsEvent[],
    weeks: number
  ): number {
    const activeWeeks = new Set(
      events.map((e) => {
        const date = new Date(e.timestamp)
        return `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`
      })
    ).size

    return activeWeeks / weeks
  }

  private calculateChurnRisk(
    dailyActive: number,
    weeklyActive: number
  ): "low" | "medium" | "high" {
    if (dailyActive > 0.7 && weeklyActive > 0.8) return "low"
    if (dailyActive > 0.3 && weeklyActive > 0.5) return "medium"
    return "high"
  }

  private getHoursSinceLastActivity(events: AnalyticsEvent[]): number {
    if (events.length === 0) return 999

    const lastEvent = Math.max(...events.map((e) => e.timestamp))
    return Math.floor((Date.now() - lastEvent) / (1000 * 60 * 60))
  }

  private analyzeRiskFactors(onChainData: OnChainMetrics): any {
    // Analisi semplificata per demo
    return {
      score: 25,
      suspicious: false,
      highRiskCount: 0,
      exploits: [],
      patterns: [],
      velocity: 15,
    }
  }

  private getRiskLevel(score: number): "low" | "medium" | "high" | "critical" {
    if (score < 25) return "low"
    if (score < 50) return "medium"
    if (score < 75) return "high"
    return "critical"
  }

  private calculateNetWorth(analytics: UserAnalytics): number {
    return (
      analytics.defiMetrics.totalValueLocked +
      analytics.nftMetrics.portfolioValueUSD +
      analytics.rewardMetrics.totalRewardsValueUSD
    )
  }

  private getTopCategory(analytics: UserAnalytics): string {
    const categories = analytics.rewardMetrics.rewardsByCategory
    if (categories.length === 0) return "general"

    return categories.reduce((max, cat) =>
      cat.totalExperience > max.totalExperience ? cat : max
    ).category
  }

  private getUserType(
    analytics: UserAnalytics
  ): "casual" | "active" | "power" | "whale" {
    const netWorth = this.calculateNetWorth(analytics)
    const activity = analytics.engagementMetrics.monthlyActiveRate

    if (netWorth > 100000) return "whale"
    if (netWorth > 10000 && activity > 0.7) return "power"
    if (activity > 0.5) return "active"
    return "casual"
  }

  private getAccountAge(onChainMetrics: OnChainMetrics): number {
    const firstTx = onChainMetrics.firstTransactionDate
    return Math.floor((Date.now() - firstTx.getTime()) / (1000 * 60 * 60 * 24))
  }

  private async getRecentEvents(
    userAddress: string,
    days: number
  ): Promise<AnalyticsEvent[]> {
    // In produzione, query da database
    // Per demo, ritorna eventi mock
    return this.eventQueue.filter(
      (e) =>
        e.address === userAddress &&
        e.timestamp > Date.now() - days * 24 * 60 * 60 * 1000
    )
  }

  private async processEvent(event: AnalyticsEvent): Promise<void> {
    // Processa evento (salva su database, aggiorna metriche, ecc.)
    this.emit("eventProcessed", event)
  }

  private async processEventQueue(): Promise<void> {
    if (this.eventQueue.length === 0) return

    const events = [...this.eventQueue]
    this.eventQueue = []

    for (const event of events) {
      await this.processEvent(event)
    }
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval)
    }

    this.chainTracker.destroy()
    this.analyticsCache.clear()
    this.eventQueue = []
    this.removeAllListeners()
  }
}
