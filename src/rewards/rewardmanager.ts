import { ethers } from "ethers"
import {
  RewardConfig,
  RewardAction,
  RewardEvent,
  UserExperience,
  Achievement,
  AchievementProgress,
  RequirementProgress,
  TrackingEvent,
  ExperienceMultiplier,
  UserStatistics,
} from "../interfaces/rewards"
import { RequirementType } from "src/interfaces/rewards/requirementtype"
import { calculateAchievementXP } from "src/core/utilities/calculateachievementxp"

export class RewardManager {
  private provider: ethers.Provider
  private config: RewardConfig
  private userExperienceCache: Map<string, UserExperience> = new Map()
  private achievementProgress: Map<string, AchievementProgress[]> = new Map()
  private activeMultipliers: Map<string, ExperienceMultiplier[]> = new Map()
  private eventListeners: Map<string, ethers.Contract> = new Map()

  constructor(provider: ethers.Provider, config: RewardConfig) {
    this.provider = provider
    this.config = {
      ...config,
      achievementDefinitions:
        config.achievementDefinitions.length > 0
          ? config.achievementDefinitions
          : [],
    }

    if (config.trackOnChainEvents) {
      this.initializeOnChainTracking()
    }
  }

  /**
   * Traccia un'azione on-chain e assegna XP
   */
  async trackOnChainAction(
    userAddress: string,
    contractAddress: string,
    eventName: string,
    transactionHash?: string
  ): Promise<RewardEvent> {
    // Trova l'azione corrispondente
    const action = this.config.achievementDefinitions.find(
      (a) =>
        a.metadata?.contractAddress === contractAddress &&
        a.metadata?.eventName === eventName
    )

    if (!action) {
      throw new Error(
        `No reward action found for ${eventName} on ${contractAddress}`
      )
    }

    // Verifica che sia un'azione on-chain
    const rewardAction: RewardAction = {
      id: `${contractAddress}_${eventName}`,
      name: eventName,
      experiencePoints: 50, // Default XP per azioni on-chain
      isOnChain: true,
      contractAddress,
      eventSignature: eventName,
    }

    // Crea evento reward
    const rewardEvent: RewardEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      userId: userAddress,
      action: rewardAction,
      experience: this.calculateExperienceWithMultipliers(
        userAddress,
        rewardAction.experiencePoints
      ),
      transactionHash,
      status: "confirmed",
    }

    // Aggiorna esperienza utente
    await this.addExperienceToUser(userAddress, rewardEvent.experience)

    // Controlla achievement
    const unlockedAchievements = await this.checkAchievements(userAddress, {
      userId: userAddress,
      actionId: rewardAction.id,
      timestamp: rewardEvent.timestamp,
      data: { contractAddress, eventName, transactionHash },
      source: "on-chain",
    })

    if (unlockedAchievements.length > 0) {
      rewardEvent.achievements = unlockedAchievements
    }

    return rewardEvent
  }

  /**
   * Traccia un'azione off-chain
   */
  async trackOffChainAction(
    userId: string,
    actionId: string,
    metadata?: Record<string, any>
  ): Promise<RewardEvent> {
    // Trova l'azione nella configurazione
    const action = this.findActionById(actionId)
    if (!action) {
      throw new Error(`Action ${actionId} not found`)
    }

    // Verifica cooldown
    if (action.cooldown) {
      const lastAction = await this.getLastActionTime(userId, actionId)
      if (lastAction && Date.now() - lastAction < action.cooldown * 1000) {
        throw new Error("Action is in cooldown period")
      }
    }

    // Verifica limite giornaliero
    if (action.maxDaily) {
      const todayCount = await this.getTodayActionCount(userId, actionId)
      if (todayCount >= action.maxDaily) {
        throw new Error("Daily limit reached for this action")
      }
    }

    // Valida l'azione se necessario
    if (action.validation?.customValidator) {
      const isValid = await action.validation.customValidator(metadata)
      if (!isValid) {
        throw new Error("Action validation failed")
      }
    }

    // Calcola XP con multiplier
    const experienceGained = this.calculateExperienceWithMultipliers(
      userId,
      action.experiencePoints
    )

    // Crea evento
    const rewardEvent: RewardEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      userId,
      action,
      experience: experienceGained,
      metadata,
      status: "confirmed",
    }

    // Aggiorna esperienza
    await this.addExperienceToUser(userId, experienceGained)

    // Controlla achievement
    const trackingEvent: TrackingEvent = {
      userId,
      actionId,
      timestamp: rewardEvent.timestamp,
      data: metadata,
      source: "off-chain",
    }

    const unlockedAchievements = await this.checkAchievements(
      userId,
      trackingEvent
    )
    if (unlockedAchievements.length > 0) {
      rewardEvent.achievements = unlockedAchievements
    }

    // Salva evento (in produzione sarebbe su database)
    await this.saveRewardEvent(rewardEvent)

    return rewardEvent
  }

  /**
   * Ottiene l'esperienza totale di un utente
   */
  async getUserExperience(userId: string): Promise<UserExperience> {
    // Controlla cache
    if (this.userExperienceCache.has(userId)) {
      return this.userExperienceCache.get(userId)!
    }

    // In produzione, recupererebbe da database
    // Per demo, creiamo un nuovo profilo
    const userExp: UserExperience = {
      userId,
      totalExperience: 0,
      currentLevelXP: 0,
      level: 1,
      nextLevelXP: this.calculateXPForLevel(2),
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

    this.userExperienceCache.set(userId, userExp)
    return userExp
  }

  /**
   * Calcola il livello basato sull'esperienza
   */
  async calculateLevel(experience: number): Promise<number> {
    const { levelFormula } = this.config

    if (levelFormula.type === "custom" && levelFormula.customFormula) {
      // Trova il livello usando la formula custom
      let level = 1
      while (levelFormula.customFormula(level + 1) <= experience) {
        level++
      }
      return level
    }

    // Formula default (exponential)
    const { baseXP, multiplier } = levelFormula
    let level = 1
    let totalXP = 0

    while (totalXP <= experience) {
      totalXP += baseXP * Math.pow(multiplier, level - 1)
      if (totalXP <= experience) level++
    }

    return level - 1
  }

  /**
   * Controlla e sblocca achievement
   */
  private async checkAchievements(
    userId: string,
    event: TrackingEvent
  ): Promise<Achievement[]> {
    const unlockedAchievements: Achievement[] = []
    const userProgress = this.achievementProgress.get(userId) || []

    for (const achievementDef of this.config.achievementDefinitions) {
      // Salta se già sbloccato
      const userExp = await this.getUserExperience(userId)
      if (userExp.achievements.some((a) => a.id === achievementDef.id)) {
        continue
      }

      // Trova o crea progress
      let progress = userProgress.find(
        (p) => p.achievementId === achievementDef.id
      )
      if (!progress) {
        progress = this.initializeAchievementProgress(userId, achievementDef)
        userProgress.push(progress)
      }

      // Aggiorna progress per ogni requisito
      let allRequirementsMet = true
      for (let i = 0; i < achievementDef.requirements.length; i++) {
        const requirement = achievementDef.requirements[i]
        const requirementProgress = progress.requirements[i]

        // Aggiorna progress basato sul tipo
        this.updateRequirementProgress(requirementProgress, requirement, event)

        if (!requirementProgress.completed) {
          requirementProgress.completed =
            requirementProgress.current >= requirementProgress.target
        }

        if (!requirementProgress.completed) {
          allRequirementsMet = false
        }
      }

      // Se tutti i requisiti sono soddisfatti, sblocca achievement
      if (allRequirementsMet && !progress.completed) {
        progress.completed = true
        const unlockedAchievement = {
          ...achievementDef,
          unlockedAt: Date.now(),
        }

        unlockedAchievements.push(unlockedAchievement)

        // Aggiungi XP achievement
        const achievementXP = calculateAchievementXP(unlockedAchievement)
        await this.addExperienceToUser(userId, achievementXP)

        // Aggiungi achievement al profilo utente
        userExp.achievements.push(unlockedAchievement)

        // Applica eventuali perk
        if (unlockedAchievement.rewards.perks) {
          userExp.unlockedPerks.push(...unlockedAchievement.rewards.perks)
        }
      }
    }

    // Salva progress aggiornato
    this.achievementProgress.set(userId, userProgress)

    return unlockedAchievements
  }

  /**
   * Inizializza il progress per un achievement
   */
  private initializeAchievementProgress(
    userId: string,
    achievement: Achievement
  ): AchievementProgress {
    return {
      achievementId: achievement.id,
      userId,
      requirements: achievement.requirements.map((req) => ({
        type: req.type,
        current: 0,
        target: req.value,
        completed: false,
        lastUpdated: Date.now(),
      })),
      startedAt: Date.now(),
      lastUpdated: Date.now(),
      completed: false,
      claimedRewards: false,
    }
  }

  /**
   * Aggiorna il progress di un requisito
   */
  private updateRequirementProgress(
    progress: RequirementProgress,
    requirement: any,
    event: TrackingEvent
  ): void {
    switch (progress.type) {
      case RequirementType.TOTAL_TRADES:
        if (event.source === "on-chain" && event.data?.eventName === "Trade") {
          progress.current++
        }
        break

      case RequirementType.VOLUME_TRADED:
        if (event.source === "on-chain" && event.data?.volume) {
          progress.current += parseFloat(event.data.volume)
        }
        break

      case RequirementType.XP_EARNED:
        // Gestito automaticamente quando si guadagna XP
        break

      case RequirementType.CHALLENGES_COMPLETED:
        if (event.actionId === "movement_challenge_completed") {
          progress.current++
        }
        break

      case RequirementType.DAYS_ACTIVE:
        // Logica per tracciare giorni attivi
        const lastActive = new Date(progress.current || Date.now())
        const today = new Date()
        if (lastActive.toDateString() !== today.toDateString()) {
          progress.current++
        }
        break

      // Aggiungi altri casi secondo necessità
    }

    progress.lastUpdated = Date.now()
  }

  /**
   * Aggiunge esperienza a un utente
   */
  private async addExperienceToUser(
    userId: string,
    experience: number
  ): Promise<void> {
    const userExp = await this.getUserExperience(userId)

    userExp.totalExperience += experience
    userExp.currentLevelXP += experience

    // Controlla level up
    const newLevel = await this.calculateLevel(userExp.totalExperience)
    if (newLevel > userExp.level) {
      userExp.level = newLevel
      userExp.currentLevelXP =
        userExp.totalExperience - this.calculateTotalXPForLevel(newLevel)
      userExp.nextLevelXP = this.calculateXPForLevel(newLevel + 1)

      // Evento level up (potresti emettere un evento qui)
      console.log(`User ${userId} leveled up to ${newLevel}!`)
    }

    // Aggiorna statistiche
    userExp.statistics.lastActiveAt = Date.now()

    // Aggiorna cache
    this.userExperienceCache.set(userId, userExp)
  }

  /**
   * Calcola XP con multiplier attivi
   */
  private calculateExperienceWithMultipliers(
    userId: string,
    baseXP: number
  ): number {
    const multipliers = this.activeMultipliers.get(userId) || []

    let totalMultiplier = this.config.experienceMultiplier

    for (const mult of multipliers) {
      if (mult.stackable) {
        totalMultiplier *= mult.multiplier
      } else {
        totalMultiplier = Math.max(totalMultiplier, mult.multiplier)
      }
    }

    return Math.floor(baseXP * totalMultiplier)
  }

  /**
   * Calcola XP necessaria per un livello
   */
  private calculateXPForLevel(level: number): number {
    const { levelFormula } = this.config

    if (levelFormula.type === "custom" && levelFormula.customFormula) {
      return levelFormula.customFormula(level)
    }

    const { baseXP, multiplier } = levelFormula
    return Math.floor(baseXP * Math.pow(multiplier, level - 1))
  }

  /**
   * Calcola XP totale per raggiungere un livello
   */
  private calculateTotalXPForLevel(level: number): number {
    let total = 0
    for (let i = 1; i < level; i++) {
      total += this.calculateXPForLevel(i)
    }
    return total
  }

  /**
   * Trova azione per ID
   */
  private findActionById(actionId: string): RewardAction | null {
    // In produzione, cercherebbe in database
    // Per demo, usiamo azioni predefinite
    const demoActions: RewardAction[] = [
      {
        id: "daily_login",
        name: "Daily Login",
        experiencePoints: 10,
        cooldown: 86400, // 24 ore
        maxDaily: 1,
        isOnChain: false,
      },
      {
        id: "movement_challenge_completed",
        name: "Movement Challenge Completed",
        experiencePoints: 50,
        isOnChain: false,
      },
      {
        id: "social_share",
        name: "Social Share",
        experiencePoints: 20,
        maxDaily: 5,
        isOnChain: false,
      },
    ]

    return demoActions.find((a) => a.id === actionId) || null
  }

  /**
   * Utility functions
   */
  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private async getLastActionTime(
    userId: string,
    actionId: string
  ): Promise<number | null> {
    // In produzione, query database
    return null
  }

  private async getTodayActionCount(
    userId: string,
    actionId: string
  ): Promise<number> {
    // In produzione, query database
    return 0
  }

  private async saveRewardEvent(event: RewardEvent): Promise<void> {
    // In produzione, salva su database
    console.log("Saving reward event:", event)
  }

  /**
   * Inizializza tracking on-chain
   */
  private async initializeOnChainTracking(): Promise<void> {
    // Setup listener per eventi on-chain
    // In produzione, monitorerebbe contratti specifici
    console.log("On-chain tracking initialized")
  }

  /**
   * Applica un multiplier temporaneo
   */
  async applyMultiplier(
    userId: string,
    multiplier: ExperienceMultiplier
  ): Promise<void> {
    const userMultipliers = this.activeMultipliers.get(userId) || []
    userMultipliers.push(multiplier)
    this.activeMultipliers.set(userId, userMultipliers)

    // Se ha durata, imposta timer per rimozione
    if (multiplier.duration) {
      setTimeout(() => {
        this.removeMultiplier(userId, multiplier.id)
      }, multiplier.duration * 1000)
    }
  }

  /**
   * Rimuove un multiplier
   */
  private removeMultiplier(userId: string, multiplierId: string): void {
    const userMultipliers = this.activeMultipliers.get(userId) || []
    const filtered = userMultipliers.filter((m) => m.id !== multiplierId)
    this.activeMultipliers.set(userId, filtered)
  }

  /**
   * Ottiene statistiche dettagliate utente
   */
  async getUserStats(userId: string): Promise<UserStatistics> {
    const userExp = await this.getUserExperience(userId)
    return userExp.statistics
  }

  /**
   * Ottiene progress achievement utente
   */
  async getUserAchievementProgress(
    userId: string
  ): Promise<AchievementProgress[]> {
    return this.achievementProgress.get(userId) || []
  }
}
