import { EventEmitter } from "events"
import {
  UserExperience,
  RewardEvent,
  TrackingEvent,
  UserStatistics,
  Leaderboard,
  LeaderboardEntry,
  ExperienceMultiplier,
  RewardNotification,
} from "../interfaces/rewards"
import { IExperienceStorage } from "src/interfaces/rewards"

/**
 * Experience Tracker - Gestisce il tracking dettagliato dell'esperienza utente
 */
export class ExperienceTracker extends EventEmitter {
  private storage: IExperienceStorage
  private experienceCache: Map<string, UserExperience> = new Map()
  private streakTracking: Map<string, { lastAction: Date; streak: number }> =
    new Map()
  private notificationQueue: RewardNotification[] = []
  private updateInterval: NodeJS.Timeout

  constructor(storage: IExperienceStorage) {
    super()
    this.storage = storage

    // Aggiorna leaderboard periodicamente
    this.updateInterval = setInterval(() => {
      this.updateAllLeaderboards()
    }, 60 * 60 * 1000) // Ogni ora
  }

  /**
   * Registra esperienza guadagnata
   */
  async trackExperience(
    userId: string,
    experience: number,
    source: RewardEvent
  ): Promise<UserExperience> {
    // Ottieni o crea profilo utente
    let userExp = await this.getOrCreateUserExperience(userId)

    // Aggiorna esperienza
    const oldLevel = userExp.level
    userExp.totalExperience += experience
    userExp.currentLevelXP += experience

    // Calcola nuovo livello
    const levelInfo = this.calculateLevelInfo(userExp.totalExperience)
    userExp.level = levelInfo.level
    userExp.currentLevelXP = levelInfo.currentLevelXP
    userExp.nextLevelXP = levelInfo.nextLevelXP

    // Aggiorna statistiche
    userExp.statistics.totalActions++
    userExp.statistics.lastActiveAt = Date.now()
    userExp.statistics.totalRewardsEarned =
      BigInt(userExp.statistics.totalRewardsEarned) + BigInt(experience)

    // Aggiorna streak
    this.updateStreak(userId, userExp)

    // Aggiungi evento alla cronologia
    userExp.rewardHistory.unshift(source)
    if (userExp.rewardHistory.length > 100) {
      userExp.rewardHistory = userExp.rewardHistory.slice(0, 100) // Mantieni solo ultimi 100
    }

    // Salva su storage
    await this.storage.saveUserExperience(userId, userExp)
    await this.storage.saveRewardEvent(source)

    // Aggiorna cache
    this.experienceCache.set(userId, userExp)

    // Emetti eventi
    this.emit("experienceGained", { userId, experience, source })

    // Controlla level up
    if (userExp.level > oldLevel) {
      this.handleLevelUp(userId, oldLevel, userExp.level)
    }

    // Crea notifica
    this.createNotification(
      userId,
      "xp_gained",
      "Experience Gained!",
      `You earned ${experience} XP from ${source.action.name}`
    )

    return userExp
  }

  /**
   * Traccia un evento generico
   */
  async trackEvent(event: TrackingEvent): Promise<void> {
    // Aggiorna statistiche basate sull'evento
    const userExp = await this.getOrCreateUserExperience(event.userId)

    switch (event.actionId) {
      case "daily_login":
        await this.storage.incrementStatistic(event.userId, "totalActions", 1)
        break

      case "trade_completed":
        if (event.data?.volume) {
          // Traccia volume tradato
          const currentVolume = Number(userExp.statistics.totalRewardsEarned)
          userExp.statistics.totalRewardsEarned = BigInt(
            currentVolume + event.data.volume
          )
        }
        break

      case "referral_completed":
        // Potresti tracciare referral in statistiche custom
        break
    }

    // Emetti evento per altri sistemi
    this.emit("eventTracked", event)
  }

  /**
   * Ottiene o crea esperienza utente
   */
  private async getOrCreateUserExperience(
    userId: string
  ): Promise<UserExperience> {
    // Controlla cache
    if (this.experienceCache.has(userId)) {
      return this.experienceCache.get(userId)!
    }

    // Controlla storage
    let userExp = await this.storage.getUserExperience(userId)

    // Crea nuovo profilo se non esiste
    if (!userExp) {
      userExp = {
        userId,
        totalExperience: 0,
        currentLevelXP: 0,
        level: 1,
        nextLevelXP: this.getXPForLevel(2),
        achievements: [],
        unlockedPerks: [],
        rewardHistory: [],
        statistics: {
          totalActions: 0,
          streak: 0,
          bestStreak: 0,
          totalRewardsEarned: BigInt(0),
          joinedAt: Date.now(),
          lastActiveAt: Date.now(),
        },
      }

      await this.storage.saveUserExperience(userId, userExp)
    }

    // Aggiorna cache
    this.experienceCache.set(userId, userExp)

    return userExp
  }

  /**
   * Calcola informazioni sul livello
   */
  private calculateLevelInfo(totalExperience: number): {
    level: number
    currentLevelXP: number
    nextLevelXP: number
  } {
    let level = 1
    let xpForCurrentLevel = 0
    let xpForNextLevel = this.getXPForLevel(2)

    while (totalExperience >= xpForNextLevel) {
      level++
      xpForCurrentLevel = xpForNextLevel
      xpForNextLevel = xpForCurrentLevel + this.getXPForLevel(level + 1)
    }

    return {
      level,
      currentLevelXP: totalExperience - xpForCurrentLevel,
      nextLevelXP: this.getXPForLevel(level + 1),
    }
  }

  /**
   * Formula per XP richiesta per livello
   */
  private getXPForLevel(level: number): number {
    // Formula progressiva: 100 * level^1.5
    return Math.floor(100 * Math.pow(level, 1.5))
  }

  /**
   * Aggiorna streak giornaliero
   */
  private updateStreak(userId: string, userExp: UserExperience): void {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const streakData = this.streakTracking.get(userId)

    if (!streakData) {
      // Prima azione
      this.streakTracking.set(userId, { lastAction: today, streak: 1 })
      userExp.statistics.streak = 1
      return
    }

    const lastAction = new Date(streakData.lastAction)
    const lastActionDay = new Date(
      lastAction.getFullYear(),
      lastAction.getMonth(),
      lastAction.getDate()
    )
    const daysDiff = Math.floor(
      (today.getTime() - lastActionDay.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysDiff === 0) {
      // Stessa giornata, mantieni streak
      return
    } else if (daysDiff === 1) {
      // Giorno consecutivo, incrementa streak
      streakData.streak++
      streakData.lastAction = today
      userExp.statistics.streak = streakData.streak

      // Aggiorna best streak
      if (streakData.streak > userExp.statistics.bestStreak) {
        userExp.statistics.bestStreak = streakData.streak
      }
    } else {
      // Streak interrotto
      streakData.streak = 1
      streakData.lastAction = today
      userExp.statistics.streak = 1
    }

    this.streakTracking.set(userId, streakData)
  }

  /**
   * Gestisce level up
   */
  private handleLevelUp(
    userId: string,
    oldLevel: number,
    newLevel: number
  ): void {
    // Emetti evento level up
    this.emit("levelUp", { userId, oldLevel, newLevel })

    // Crea notifica
    this.createNotification(
      userId,
      "level_up",
      `Level ${newLevel} Reached!`,
      `Congratulations! You've advanced from level ${oldLevel} to level ${newLevel}!`
    )

    // Log per debug
    console.log(`User ${userId} leveled up: ${oldLevel} → ${newLevel}`)
  }

  /**
   * Crea una notifica
   */
  private createNotification(
    userId: string,
    type: RewardNotification["type"],
    title: string,
    message: string,
    data?: any
  ): void {
    const notification: RewardNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type,
      title,
      message,
      data,
      read: false,
      createdAt: Date.now(),
    }

    this.notificationQueue.push(notification)
    this.emit("notification", notification)
  }

  /**
   * Ottiene leaderboard
   */
  async getLeaderboard(
    period: "daily" | "weekly" | "monthly" | "all-time" = "all-time",
    limit: number = 100
  ): Promise<Leaderboard> {
    return await this.storage.getLeaderboard(period, limit)
  }

  /**
   * Aggiorna tutte le leaderboard
   */
  private async updateAllLeaderboards(): Promise<void> {
    try {
      await Promise.all([
        this.storage.updateLeaderboard("daily"),
        this.storage.updateLeaderboard("weekly"),
        this.storage.updateLeaderboard("monthly"),
        this.storage.updateLeaderboard("all-time"),
      ])
    } catch (error) {
      console.error("Error updating leaderboards:", error)
    }
  }

  /**
   * Ottiene posizione utente in classifica
   */
  async getUserRank(
    userId: string,
    period: "daily" | "weekly" | "monthly" | "all-time" = "all-time"
  ): Promise<number | null> {
    const leaderboard = await this.getLeaderboard(period, 1000)
    const entry = leaderboard.entries.find((e) => e.userId === userId)
    return entry?.rank || null
  }

  /**
   * Ottiene statistiche aggregate
   */
  async getAggregateStats(): Promise<{
    totalUsers: number
    totalExperience: bigint
    averageLevel: number
    activeToday: number
    activeThisWeek: number
  }> {
    // In produzione, queste sarebbero query aggregate sul database
    // Per demo, usiamo valori simulati
    return {
      totalUsers: this.experienceCache.size,
      totalExperience: BigInt(
        Array.from(this.experienceCache.values()).reduce(
          (sum, user) => sum + user.totalExperience,
          0
        )
      ),
      averageLevel: Math.floor(
        Array.from(this.experienceCache.values()).reduce(
          (sum, user) => sum + user.level,
          0
        ) / Math.max(1, this.experienceCache.size)
      ),
      activeToday: Math.floor(this.experienceCache.size * 0.3),
      activeThisWeek: Math.floor(this.experienceCache.size * 0.7),
    }
  }

  /**
   * Esporta dati utente (GDPR compliance)
   */
  async exportUserData(userId: string): Promise<{
    profile: UserExperience
    rewardHistory: RewardEvent[]
    notifications: RewardNotification[]
  }> {
    const profile = await this.getOrCreateUserExperience(userId)
    const rewardHistory = await this.storage.getRewardHistory(userId, 1000)
    const notifications = this.notificationQueue.filter(
      (n) => n.userId === userId
    )

    return {
      profile,
      rewardHistory,
      notifications,
    }
  }

  /**
   * Cancella dati utente (GDPR compliance)
   */
  async deleteUserData(userId: string): Promise<void> {
    // Rimuovi da cache
    this.experienceCache.delete(userId)
    this.streakTracking.delete(userId)

    // Rimuovi notifiche
    this.notificationQueue = this.notificationQueue.filter(
      (n) => n.userId !== userId
    )

    // In produzione, cancellare anche da database
    console.log(`User data deleted for ${userId}`)
  }

  /**
   * Applica boost XP temporaneo
   */
  async applyXPBoost(
    userId: string,
    multiplier: number,
    durationSeconds: number,
    reason: string
  ): Promise<void> {
    const boost: ExperienceMultiplier = {
      id: `boost_${Date.now()}`,
      name: reason,
      multiplier,
      condition: {
        type: "time_based",
        value: Date.now() + durationSeconds * 1000,
      },
      duration: durationSeconds,
      stackable: true,
    }

    // Emetti evento per RewardManager
    this.emit("xpBoostApplied", { userId, boost })

    // Notifica utente
    this.createNotification(
      userId,
      "xp_gained",
      "XP Boost Active!",
      `${multiplier}x XP boost active for ${Math.floor(
        durationSeconds / 60
      )} minutes!`
    )
  }

  /**
   * Ottiene notifiche non lette
   */
  getUnreadNotifications(userId: string): RewardNotification[] {
    return this.notificationQueue
      .filter((n) => n.userId === userId && !n.read)
      .sort((a, b) => b.createdAt - a.createdAt)
  }

  /**
   * Segna notifiche come lette
   */
  markNotificationsAsRead(userId: string, notificationIds: string[]): void {
    this.notificationQueue.forEach((notification) => {
      if (
        notification.userId === userId &&
        notificationIds.includes(notification.id)
      ) {
        notification.read = true
      }
    })
  }

  /**
   * Cleanup risorse
   */
  destroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
    }
    this.removeAllListeners()
    this.experienceCache.clear()
    this.streakTracking.clear()
    this.notificationQueue = []
  }
}

// Implementazione in-memory per testing/demo
export class InMemoryExperienceStorage implements IExperienceStorage {
  private users: Map<string, UserExperience> = new Map()
  private events: RewardEvent[] = []
  private leaderboards: Map<string, Leaderboard> = new Map()

  async saveUserExperience(
    userId: string,
    experience: UserExperience
  ): Promise<void> {
    this.users.set(userId, experience)
  }

  async getUserExperience(userId: string): Promise<UserExperience | null> {
    return this.users.get(userId) || null
  }

  async saveRewardEvent(event: RewardEvent): Promise<void> {
    this.events.push(event)
  }

  async getRewardHistory(
    userId: string,
    limit = 100,
    offset = 0
  ): Promise<RewardEvent[]> {
    return this.events
      .filter((e) => e.userId === userId)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(offset, offset + limit)
  }

  async updateLeaderboard(
    period: "daily" | "weekly" | "monthly" | "all-time"
  ): Promise<void> {
    const entries: LeaderboardEntry[] = Array.from(this.users.values())
      .map((user, index) => ({
        rank: 0, // Sarà calcolato dopo
        userId: user.userId,
        level: user.level,
        totalExperience: user.totalExperience,
        achievementCount: user.achievements.length,
        change: 0, // Per semplicità
      }))
      .sort((a, b) => b.totalExperience - a.totalExperience)
      .map((entry, index) => ({ ...entry, rank: index + 1 }))

    this.leaderboards.set(period, {
      period,
      entries,
      lastUpdated: Date.now(),
      totalParticipants: this.users.size,
    })
  }

  async getLeaderboard(
    period: "daily" | "weekly" | "monthly" | "all-time",
    limit = 100
  ): Promise<Leaderboard> {
    const leaderboard = this.leaderboards.get(period) || {
      period,
      entries: [],
      lastUpdated: Date.now(),
      totalParticipants: 0,
    }

    return {
      ...leaderboard,
      entries: leaderboard.entries.slice(0, limit),
    }
  }

  async incrementStatistic(
    userId: string,
    stat: keyof UserStatistics,
    value: number
  ): Promise<void> {
    const user = await this.getUserExperience(userId)
    if (user && typeof user.statistics[stat] === "number") {
      ;(user.statistics[stat] as number) += value
      await this.saveUserExperience(userId, user)
    }
  }
}
