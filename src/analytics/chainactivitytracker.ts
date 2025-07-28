import { ethers, Contract, Log } from "ethers"
import { EventEmitter } from "events"
import {
  OnChainMetrics,
  ContractInteraction,
  TokenVolume,
  NetworkStats,
  AnalyticsEvent,
  AnalyticsConfig,
  TimeFrame,
} from "../interfaces/analytics"

/**
 * ERC20 ABI minimo per tracking
 */
const ERC20_ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
]

/**
 * Chain Activity Tracker - Monitora attività on-chain in real-time
 */
export class ChainActivityTracker extends EventEmitter {
  private providers: Map<number, ethers.Provider> = new Map()
  private config: AnalyticsConfig
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private subscriptions: Map<string, any> = new Map()
  private tokenInfoCache: Map<string, any> = new Map()
  private priceCache: Map<string, number> = new Map()

  constructor(config: AnalyticsConfig) {
    super()
    this.config = config
    this.initializeProviders()
  }

  /**
   * Inizializza provider per ogni chain
   */
  private initializeProviders(): void {
    for (const [chainId, rpcUrl] of Object.entries(this.config.rpcEndpoints)) {
      this.providers.set(Number(chainId), new ethers.JsonRpcProvider(rpcUrl))
    }
  }

  /**
   * Traccia attività per un indirizzo
   */
  async trackAddress(
    address: string,
    chainIds?: number[]
  ): Promise<OnChainMetrics> {
    const targetChains = chainIds || Array.from(this.providers.keys())
    const metrics: OnChainMetrics = this.initializeMetrics()

    // Raccogli dati da ogni chain
    const chainPromises = targetChains.map((chainId) =>
      this.getChainActivity(address, chainId)
    )

    const chainResults = await Promise.all(chainPromises)

    // Aggrega risultati
    for (const result of chainResults) {
      this.aggregateMetrics(metrics, result)
    }

    // Calcola metriche derivate
    this.calculateDerivedMetrics(metrics)

    // Emetti evento
    this.emit("addressTracked", { address, metrics })

    return metrics
  }

  /**
   * Ottiene attività per una chain specifica
   */
  private async getChainActivity(
    address: string,
    chainId: number
  ): Promise<Partial<OnChainMetrics>> {
    const provider = this.providers.get(chainId)
    if (!provider) {
      throw new Error(`No provider for chain ${chainId}`)
    }

    // Controlla cache
    const cacheKey = `${address}-${chainId}`
    if (this.config.cacheEnabled) {
      const cached = this.getFromCache(cacheKey)
      if (cached) return cached
    }

    const metrics: Partial<OnChainMetrics> = {
      totalTransactions: 0,
      successfulTransactions: 0,
      failedTransactions: 0,
      totalVolumeUSD: 0,
      totalVolumeETH: 0,
      gasSpent: BigInt(0),
      contractInteractions: [],
      networksUsed: [],
    }

    try {
      // Ottieni transaction count
      const txCount = await provider.getTransactionCount(address)
      metrics.totalTransactions = txCount

      // Ottieni transaction history (ultimi blocchi)
      const currentBlock = await provider.getBlockNumber()
      const fromBlock = Math.max(0, currentBlock - 10000) // Ultimi 10k blocchi

      // Query transaction logs
      const logs = await this.getTransactionLogs(
        provider,
        address,
        fromBlock,
        currentBlock
      )

      // Processa logs
      for (const log of logs) {
        await this.processLog(log, metrics, provider)
      }

      // Aggiungi network stats
      metrics.networksUsed = [
        {
          chainId,
          name: this.getChainName(chainId),
          transactionCount: txCount,
          volumeUSD: metrics.totalVolumeUSD || 0,
          gasSpent: metrics.gasSpent || BigInt(0),
          lastActivity: new Date(),
        },
      ]
    } catch (error) {
      console.error(`Error tracking chain ${chainId}:`, error)
    }

    // Salva in cache
    if (this.config.cacheEnabled) {
      this.saveToCache(cacheKey, metrics)
    }

    return metrics
  }

  /**
   * Ottiene logs delle transazioni
   */
  private async getTransactionLogs(
    provider: ethers.Provider,
    address: string,
    fromBlock: number,
    toBlock: number
  ): Promise<Log[]> {
    try {
      // Filtra per address come from o to
      const filter = {
        fromBlock,
        toBlock,
        topics: [
          null, // any event
          [ethers.zeroPadValue(address, 32), null],
        ],
      }

      //const logs = await provider.getLogs(filter);
      const logs = await provider.getLogs({})

      // Filtra anche logs dove address è 'to'
      const filterTo = {
        fromBlock,
        toBlock,
        topics: [null, null, ethers.zeroPadValue(address, 32)],
      }

      const logsTo = await provider.getLogs(filterTo)

      // Combina e deduplica
      const allLogs = [...logs, ...logsTo]
      const uniqueLogs = Array.from(
        new Map(allLogs.map((log) => [log.transactionHash, log])).values()
      )

      return uniqueLogs
    } catch (error) {
      console.error("Error fetching logs:", error)
      return []
    }
  }

  /**
   * Processa un log
   */
  private async processLog(
    log: Log,
    metrics: Partial<OnChainMetrics>,
    provider: ethers.Provider
  ): Promise<void> {
    try {
      // Ottieni transaction receipt per gas info
      const receipt = await provider.getTransactionReceipt(log.transactionHash)
      if (!receipt) return

      // Aggiorna contatori
      if (receipt.status === 1) {
        metrics.successfulTransactions =
          (metrics.successfulTransactions || 0) + 1
      } else {
        metrics.failedTransactions = (metrics.failedTransactions || 0) + 1
      }

      // Calcola gas speso
      const gasUsed = receipt.gasUsed
      const gasPrice = receipt.gasPrice || BigInt(0)
      const gasCost = gasUsed * gasPrice
      metrics.gasSpent = (metrics.gasSpent || BigInt(0)) + gasCost

      // Traccia interazione contratto
      this.trackContractInteraction(log.address, metrics)

      // Se è un transfer ERC20, traccia volume
      if (this.isERC20Transfer(log)) {
        await this.processERC20Transfer(log, metrics, provider)
      }
    } catch (error) {
      console.error("Error processing log:", error)
    }
  }

  /**
   * Verifica se è un transfer ERC20
   */
  private isERC20Transfer(log: Log): boolean {
    // Topic[0] è l'hash dell'evento Transfer
    const transferTopic = ethers.id("Transfer(address,address,uint256)")
    return log.topics[0] === transferTopic && log.topics.length === 3
  }

  /**
   * Processa transfer ERC20
   */
  private async processERC20Transfer(
    log: Log,
    metrics: Partial<OnChainMetrics>,
    provider: ethers.Provider
  ): Promise<void> {
    try {
      const tokenAddress = log.address

      // Ottieni info token
      const tokenInfo = await this.getTokenInfo(tokenAddress, provider)
      if (!tokenInfo) return

      // Decodifica amount
      const amount = BigInt(log.data)
      const decimals = tokenInfo.decimals
      const amountFormatted = Number(amount) / Math.pow(10, decimals)

      // Ottieni prezzo USD
      const priceUSD = await this.getTokenPrice(tokenAddress, tokenInfo.symbol)
      const volumeUSD = amountFormatted * priceUSD

      // Aggiorna metriche volume
      metrics.totalVolumeUSD = (metrics.totalVolumeUSD || 0) + volumeUSD

      if (tokenInfo.symbol === "ETH" || tokenInfo.symbol === "WETH") {
        metrics.totalVolumeETH = (metrics.totalVolumeETH || 0) + amountFormatted
      }

      // Aggiorna volume by token
      if (!metrics.volumeByToken) metrics.volumeByToken = []

      const existingToken = metrics.volumeByToken.find(
        (t) => t.tokenAddress.toLowerCase() === tokenAddress.toLowerCase()
      )

      if (existingToken) {
        existingToken.volume += amount
        existingToken.volumeUSD += volumeUSD
        existingToken.transactionCount++
      } else {
        metrics.volumeByToken.push({
          tokenAddress,
          symbol: tokenInfo.symbol,
          decimals: tokenInfo.decimals,
          volume: amount,
          volumeUSD,
          transactionCount: 1,
        })
      }
    } catch (error) {
      console.error("Error processing ERC20 transfer:", error)
    }
  }

  /**
   * Ottiene informazioni token
   */
  private async getTokenInfo(
    tokenAddress: string,
    provider: ethers.Provider
  ): Promise<any> {
    // Controlla cache
    if (this.tokenInfoCache.has(tokenAddress)) {
      return this.tokenInfoCache.get(tokenAddress)
    }

    try {
      const contract = new Contract(tokenAddress, ERC20_ABI, provider)

      const [symbol, decimals, name] = await Promise.all([
        contract.symbol(),
        contract.decimals(),
        contract.name().catch(() => "Unknown"),
      ])

      const info = { symbol, decimals, name }
      this.tokenInfoCache.set(tokenAddress, info)

      return info
    } catch (error) {
      console.error(`Error fetching token info for ${tokenAddress}:`, error)
      return null
    }
  }

  /**
   * Ottiene prezzo token (mock per demo)
   */
  private async getTokenPrice(
    tokenAddress: string,
    symbol: string
  ): Promise<number> {
    // In produzione, useresti Coingecko, Chainlink, ecc.
    const mockPrices: Record<string, number> = {
      ETH: 2000,
      WETH: 2000,
      USDC: 1,
      USDT: 1,
      DAI: 1,
      WBTC: 40000,
    }

    return mockPrices[symbol] || 0
  }

  /**
   * Traccia interazione con contratto
   */
  private trackContractInteraction(
    contractAddress: string,
    metrics: Partial<OnChainMetrics>
  ): void {
    if (!metrics.contractInteractions) {
      metrics.contractInteractions = []
    }

    const existing = metrics.contractInteractions.find(
      (c) => c.address.toLowerCase() === contractAddress.toLowerCase()
    )

    if (existing) {
      existing.interactionCount++
      existing.lastInteraction = new Date()
    } else {
      metrics.contractInteractions.push({
        address: contractAddress,
        interactionCount: 1,
        lastInteraction: new Date(),
        methods: [],
      })
    }

    metrics.uniqueContractsInteracted = metrics.contractInteractions.length
  }

  /**
   * Sottoscrivi a eventi real-time
   */
  async subscribeToAddress(
    address: string,
    chainId: number,
    callback: (event: AnalyticsEvent) => void
  ): Promise<string> {
    const provider = this.providers.get(chainId)
    if (!provider) {
      throw new Error(`No provider for chain ${chainId}`)
    }

    const subscriptionId = `${address}-${chainId}-${Date.now()}`

    // Sottoscrivi a nuovi blocchi
    const filter = {
      address: null, // tutti i contratti
      topics: [null, [ethers.zeroPadValue(address, 32), null]],
    }

    //provider.on(filter, ...)
    provider.on({}, (log) => {
      const event: AnalyticsEvent = {
        userId: address,
        address,
        eventType: "transaction",
        category: "on-chain",
        action: "transaction",
        value: 0,
        metadata: {
          chainId,
          transactionHash: log.transactionHash,
          blockNumber: log.blockNumber,
          contractAddress: log.address,
        },
        timestamp: Date.now(),
      }

      callback(event)
      this.emit("realtimeEvent", event)
    })

    this.subscriptions.set(subscriptionId, filter)
    return subscriptionId
  }

  /**
   * Cancella sottoscrizione
   */
  unsubscribe(subscriptionId: string): void {
    const filter = this.subscriptions.get(subscriptionId)
    if (filter) {
      // Trova provider corretto
      const [address, chainId] = subscriptionId.split("-")
      const provider = this.providers.get(Number(chainId))

      if (provider) {
        provider.off(filter)
      }

      this.subscriptions.delete(subscriptionId)
    }
  }

  /**
   * Helper functions
   */

  private initializeMetrics(): OnChainMetrics {
    return {
      totalTransactions: 0,
      successfulTransactions: 0,
      failedTransactions: 0,
      totalVolumeUSD: 0,
      totalVolumeETH: 0,
      volumeByToken: [],
      gasSpent: BigInt(0),
      gasSpentUSD: 0,
      averageGasPrice: BigInt(0),
      uniqueContractsInteracted: 0,
      contractInteractions: [],
      contractsDeployed: 0,
      firstTransactionDate: new Date(),
      lastTransactionDate: new Date(),
      activeDays: 0,
      longestInactivePeriod: 0,
      networksUsed: [],
      bridgeTransactions: 0,
      crossChainVolume: 0,
    }
  }

  private aggregateMetrics(
    total: OnChainMetrics,
    partial: Partial<OnChainMetrics>
  ): void {
    total.totalTransactions += partial.totalTransactions || 0
    total.successfulTransactions += partial.successfulTransactions || 0
    total.failedTransactions += partial.failedTransactions || 0
    total.totalVolumeUSD += partial.totalVolumeUSD || 0
    total.totalVolumeETH += partial.totalVolumeETH || 0
    total.gasSpent = total.gasSpent + (partial.gasSpent || BigInt(0))

    // Merge contract interactions
    if (partial.contractInteractions) {
      for (const interaction of partial.contractInteractions) {
        const existing = total.contractInteractions.find(
          (c) => c.address.toLowerCase() === interaction.address.toLowerCase()
        )

        if (existing) {
          existing.interactionCount += interaction.interactionCount
        } else {
          total.contractInteractions.push(interaction)
        }
      }
    }

    // Merge networks
    if (partial.networksUsed) {
      total.networksUsed.push(...partial.networksUsed)
    }

    // Merge token volumes
    if (partial.volumeByToken) {
      for (const tokenVolume of partial.volumeByToken) {
        const existing = total.volumeByToken.find(
          (t) =>
            t.tokenAddress.toLowerCase() ===
            tokenVolume.tokenAddress.toLowerCase()
        )

        if (existing) {
          existing.volume += tokenVolume.volume
          existing.volumeUSD += tokenVolume.volumeUSD
          existing.transactionCount += tokenVolume.transactionCount
        } else {
          total.volumeByToken.push(tokenVolume)
        }
      }
    }
  }

  private calculateDerivedMetrics(metrics: OnChainMetrics): void {
    // Calcola unique contracts
    metrics.uniqueContractsInteracted = metrics.contractInteractions.length

    // Calcola gas medio
    if (metrics.totalTransactions > 0) {
      metrics.averageGasPrice =
        metrics.gasSpent / BigInt(metrics.totalTransactions)
    }

    // Calcola gas in USD (assumendo prezzo ETH)
    const ethPrice = 2000 // Mock
    metrics.gasSpentUSD = (Number(metrics.gasSpent) / 1e18) * ethPrice

    // Ordina token per volume
    metrics.volumeByToken.sort((a, b) => b.volumeUSD - a.volumeUSD)

    // Identifica bridge transactions
    metrics.bridgeTransactions = metrics.contractInteractions
      .filter((c) => this.isBridgeContract(c.address))
      .reduce((sum, c) => sum + c.interactionCount, 0)
  }

  private isBridgeContract(address: string): boolean {
    // Lista di bridge conosciuti (mock)
    const bridges = [
      "0x...", // Arbitrum Bridge
      "0x...", // Optimism Bridge
      // etc.
    ]

    return bridges.includes(address.toLowerCase())
  }

  private getChainName(chainId: number): string {
    const names: Record<number, string> = {
      1: "Ethereum",
      137: "Polygon",
      42161: "Arbitrum",
      10: "Optimism",
      56: "BSC",
      43114: "Avalanche",
    }

    return names[chainId] || `Chain ${chainId}`
  }

  private getFromCache(key: string): any {
    const cached = this.cache.get(key)
    if (!cached) return null

    const age = Date.now() - cached.timestamp
    if (age > this.config.cacheDuration * 1000) {
      this.cache.delete(key)
      return null
    }

    return cached.data
  }

  private saveToCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    })
  }

  /**
   * Cleanup
   */
  destroy(): void {
    // Cancella tutte le sottoscrizioni
    for (const subscriptionId of this.subscriptions.keys()) {
      this.unsubscribe(subscriptionId)
    }

    // Clear caches
    this.cache.clear()
    this.tokenInfoCache.clear()
    this.priceCache.clear()

    // Remove listeners
    this.removeAllListeners()
  }
}
