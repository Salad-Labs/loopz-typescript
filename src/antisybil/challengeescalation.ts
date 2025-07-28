export class ChallengeEscalation {
  private readonly STORAGE_KEY = "loopz_anti_sybil_attempts"
  private readonly RESET_AFTER_DAYS = 7 // Reset dopo 7 giorni di inattività

  /**
   * Ottiene il numero di tentativi per un fingerprint
   */
  getAttemptCount(fingerprint: string): number {
    const data = this.getAttemptsData()
    const record = data[fingerprint]

    if (!record) return 0

    // Verifica se è passato troppo tempo dall'ultimo tentativo
    const daysSinceLastAttempt =
      (Date.now() - record.lastAttempt) / (1000 * 60 * 60 * 24)
    if (daysSinceLastAttempt > this.RESET_AFTER_DAYS) {
      this.resetAttemptCount(fingerprint)
      return 0
    }

    return record.count
  }

  /**
   * Incrementa il contatore dei tentativi
   */
  incrementAttemptCount(fingerprint: string): void {
    const data = this.getAttemptsData()

    if (!data[fingerprint]) {
      data[fingerprint] = { count: 0, lastAttempt: 0 }
    }

    data[fingerprint].count++
    data[fingerprint].lastAttempt = Date.now()

    this.saveAttemptsData(data)
  }

  /**
   * Reset del contatore per un fingerprint
   */
  resetAttemptCount(fingerprint: string): void {
    const data = this.getAttemptsData()
    delete data[fingerprint]
    this.saveAttemptsData(data)
  }

  /**
   * Calcola la distanza richiesta basata sui tentativi
   * Progressione: 100m, 200m, 400m, 800m, 1600m, ...
   */
  getRequiredDistance(attemptCount: number): number {
    const baseDistance = 100 // 100 metri base
    const maxDistance = 10000 // 10 km massimo

    const distance = baseDistance * Math.pow(2, attemptCount)
    return Math.min(distance, maxDistance)
  }

  /**
   * Ottiene il tempo di cooldown basato sui tentativi
   * Progressione: 0, 5min, 15min, 30min, 1h, 2h, ...
   */
  getCooldownTime(attemptCount: number): number {
    if (attemptCount === 0) return 0

    const cooldowns = [
      0, // 1° tentativo: nessun cooldown
      5 * 60, // 2° tentativo: 5 minuti
      15 * 60, // 3° tentativo: 15 minuti
      30 * 60, // 4° tentativo: 30 minuti
      60 * 60, // 5° tentativo: 1 ora
      2 * 60 * 60, // 6° tentativo: 2 ore
      4 * 60 * 60, // 7° tentativo: 4 ore
      8 * 60 * 60, // 8° tentativo: 8 ore
      24 * 60 * 60, // 9+ tentativi: 24 ore
    ]

    const index = Math.min(attemptCount, cooldowns.length - 1)
    return cooldowns[index] * 1000 // Converti in millisecondi
  }

  /**
   * Verifica se un fingerprint è in cooldown
   */
  isInCooldown(fingerprint: string): {
    inCooldown: boolean
    remainingTime: number
  } {
    const data = this.getAttemptsData()
    const record = data[fingerprint]

    if (!record) return { inCooldown: false, remainingTime: 0 }

    const cooldownTime = this.getCooldownTime(record.count - 1)
    const timeSinceLastAttempt = Date.now() - record.lastAttempt

    if (timeSinceLastAttempt < cooldownTime) {
      return {
        inCooldown: true,
        remainingTime: cooldownTime - timeSinceLastAttempt,
      }
    }

    return { inCooldown: false, remainingTime: 0 }
  }

  /**
   * Ottiene statistiche per un fingerprint
   */
  getStats(fingerprint: string): {
    attemptCount: number
    lastAttempt: Date | null
    nextDistance: number
    cooldownRemaining: number
  } {
    const attemptCount = this.getAttemptCount(fingerprint)
    const data = this.getAttemptsData()
    const record = data[fingerprint]

    const cooldown = this.isInCooldown(fingerprint)

    return {
      attemptCount,
      lastAttempt: record ? new Date(record.lastAttempt) : null,
      nextDistance: this.getRequiredDistance(attemptCount),
      cooldownRemaining: cooldown.remainingTime,
    }
  }

  /**
   * Pulisce i dati vecchi (opzionale, per manutenzione)
   */
  cleanupOldData(): void {
    const data = this.getAttemptsData()
    const now = Date.now()
    const maxAge = this.RESET_AFTER_DAYS * 24 * 60 * 60 * 1000

    for (const fingerprint in data) {
      if (now - data[fingerprint].lastAttempt > maxAge) {
        delete data[fingerprint]
      }
    }

    this.saveAttemptsData(data)
  }

  private getAttemptsData(): Record<
    string,
    { count: number; lastAttempt: number }
  > {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY)
      return data ? JSON.parse(data) : {}
    } catch (error) {
      console.error("Error reading attempts data:", error)
      return {}
    }
  }

  private saveAttemptsData(
    data: Record<string, { count: number; lastAttempt: number }>
  ): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error("Error saving attempts data:", error)
      // In caso di quota exceeded, prova a pulire dati vecchi
      if (error instanceof Error && error.name === "QuotaExceededError") {
        this.cleanupOldData()
        // Riprova
        try {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data))
        } catch {
          // Se fallisce ancora, almeno mantieni in memoria
          console.error("Unable to save to localStorage")
        }
      }
    }
  }
}
