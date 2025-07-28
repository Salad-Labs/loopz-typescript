import { EventEmitter } from "events"
import { SoulBoundTokenManager } from "./soulboundtokenmanager"
import { ProgressData, SoulBoundTokenMetadata } from "../interfaces/soulbound"

/**
 * Classe helper per gestire il binding automatico dei progressi
 */
export class ProgressBinding extends EventEmitter {
  private sbtManager: SoulBoundTokenManager
  private userTokenMap: Map<string, number> = new Map()
  private progressQueue: Map<string, ProgressData[]> = new Map()
  private batchInterval: NodeJS.Timeout
  private batchSize: number = 10
  private batchDelay: number = 5000 // 5 secondi

  constructor(sbtManager: SoulBoundTokenManager) {
    super()
    this.sbtManager = sbtManager

    // Processa queue periodicamente
    this.batchInterval = setInterval(() => {
      this.processBatchUpdates()
    }, this.batchDelay)
  }

  /**
   * Registra progress per un utente
   */
  async trackProgress(
    userAddress: string,
    progress: ProgressData
  ): Promise<void> {
    // Ottieni tokenId dell'utente
    let tokenId = this.userTokenMap.get(userAddress)

    if (!tokenId) {
      const token = await this.sbtManager.getUserToken(userAddress)
      if (!token) {
        throw new Error("User does not have a Soul Bound Token")
      }
      tokenId = token.tokenId
      this.userTokenMap.set(userAddress, tokenId)
    }

    // Aggiungi alla queue
    const userQueue = this.progressQueue.get(userAddress) || []
    userQueue.push(progress)
    this.progressQueue.set(userAddress, userQueue)

    // Emetti evento
    this.emit("progressTracked", { userAddress, progress })

    // Se la queue è piena, processa immediatamente
    if (userQueue.length >= this.batchSize) {
      await this.processUserProgress(userAddress)
    }
  }

  /**
   * Traccia achievement unlock
   */
  async trackAchievement(
    userAddress: string,
    achievementId: string,
    achievementName: string,
    tier: "bronze" | "silver" | "gold" | "platinum" | "diamond"
  ): Promise<void> {
    const progress: ProgressData = {
      category: "achievement",
      action: "unlock",
      value: {
        id: achievementId,
        name: achievementName,
        unlockedAt: Date.now(),
        tier,
      },
      timestamp: Date.now(),
    }

    await this.trackProgress(userAddress, progress)
  }

  /**
   * Traccia guadagno esperienza
   */
  async trackExperience(
    userAddress: string,
    amount: number,
    source: string
  ): Promise<void> {
    const progress: ProgressData = {
      category: "experience",
      action: "gain",
      value: amount,
      timestamp: Date.now(),
      metadata: { source },
    }

    await this.trackProgress(userAddress, progress)
  }

  /**
   * Traccia statistiche
   */
  async trackStats(
    userAddress: string,
    statType: string,
    value: any
  ): Promise<void> {
    const progress: ProgressData = {
      category: "stats",
      action: statType,
      value,
      timestamp: Date.now(),
    }

    await this.trackProgress(userAddress, progress)
  }

  /**
   * Processa batch updates
   */
  private async processBatchUpdates(): Promise<void> {
    const users = Array.from(this.progressQueue.keys())

    for (const userAddress of users) {
      const queue = this.progressQueue.get(userAddress)
      if (queue && queue.length > 0) {
        await this.processUserProgress(userAddress)
      }
    }
  }

  /**
   * Processa progress di un singolo utente
   */
  private async processUserProgress(userAddress: string): Promise<void> {
    const queue = this.progressQueue.get(userAddress)
    if (!queue || queue.length === 0) return

    const tokenId = this.userTokenMap.get(userAddress)
    if (!tokenId) return

    try {
      // Raggruppa progress per categoria per efficienza
      const groupedProgress = this.groupProgressByCategory(queue)

      // Applica ogni gruppo
      for (const [category, progressList] of Object.entries(groupedProgress)) {
        const mergedProgress = this.mergeProgress(category as any, progressList)
        await this.sbtManager.bindProgress(tokenId, mergedProgress)
      }

      // Pulisci queue
      this.progressQueue.delete(userAddress)

      // Emetti evento
      this.emit("progressBound", {
        userAddress,
        progressCount: queue.length,
        tokenId,
      })
    } catch (error) {
      console.error(`Error binding progress for ${userAddress}:`, error)
      this.emit("error", { userAddress, error })
    }
  }

  /**
   * Raggruppa progress per categoria
   */
  private groupProgressByCategory(
    progressList: ProgressData[]
  ): Record<string, ProgressData[]> {
    return progressList.reduce((acc, progress) => {
      if (!acc[progress.category]) {
        acc[progress.category] = []
      }
      acc[progress.category].push(progress)
      return acc
    }, {} as Record<string, ProgressData[]>)
  }

  /**
   * Merge progress della stessa categoria
   */
  private mergeProgress(
    category: ProgressData["category"],
    progressList: ProgressData[]
  ): ProgressData {
    if (progressList.length === 1) {
      return progressList[0]
    }

    switch (category) {
      case "experience":
        // Somma esperienza
        const totalExp = progressList.reduce(
          (sum, p) => sum + Number(p.value),
          0
        )
        return {
          category: "experience",
          action: "gain",
          value: totalExp,
          timestamp: Date.now(),
          metadata: {
            sources: progressList.map((p) => p.metadata?.source || "unknown"),
          },
        }

      case "achievement":
        // Prendi l'ultimo achievement (assumendo che siano in ordine)
        return progressList[progressList.length - 1]

      case "stats":
        // Per stats, applica l'ultimo valore per ogni tipo
        const latestStats: Record<string, any> = {}
        progressList.forEach((p) => {
          latestStats[p.action] = p.value
        })
        return {
          category: "stats",
          action: "batch_update",
          value: latestStats,
          timestamp: Date.now(),
        }

      default:
        // Default: prendi l'ultimo
        return progressList[progressList.length - 1]
    }
  }

  /**
   * Ottieni statistiche binding
   */
  getStats(): {
    queuedUsers: number
    totalQueuedProgress: number
    cachedTokens: number
  } {
    let totalQueued = 0
    this.progressQueue.forEach((queue) => {
      totalQueued += queue.length
    })

    return {
      queuedUsers: this.progressQueue.size,
      totalQueuedProgress: totalQueued,
      cachedTokens: this.userTokenMap.size,
    }
  }

  /**
   * Forza processing immediato per un utente
   */
  async forceProcess(userAddress: string): Promise<void> {
    await this.processUserProgress(userAddress)
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.batchInterval) {
      clearInterval(this.batchInterval)
    }
    this.removeAllListeners()
    this.userTokenMap.clear()
    this.progressQueue.clear()
  }
}
