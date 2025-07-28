import { ChallengeConfig, ChallengeResult } from "src/interfaces/antisybil"
import { ChallengeEscalation } from "./challengeescalation"
import { DeviceFingerprint } from "./devicefingerprint"
import { MovementChallenge } from "./movementchallenge"

export class AntiSybilManager {
  private fingerprint: DeviceFingerprint
  private movement: MovementChallenge
  private escalation: ChallengeEscalation

  constructor() {
    this.fingerprint = new DeviceFingerprint()
    this.movement = new MovementChallenge()
    this.escalation = new ChallengeEscalation()
  }

  /**
   * Esegue una challenge anti-sybil completa
   */
  async executeChallenge(config?: ChallengeConfig): Promise<{
    success: boolean
    fingerprint: string
    result: ChallengeResult
    attemptCount: number
  }> {
    // 1. Genera fingerprint
    const deviceFingerprint = await this.fingerprint.getFingerprint()

    // 2. Verifica cooldown
    const cooldownStatus = this.escalation.isInCooldown(deviceFingerprint)
    if (cooldownStatus.inCooldown) {
      throw new Error(
        `Please wait ${Math.ceil(
          cooldownStatus.remainingTime / 60000
        )} minutes before trying again`
      )
    }

    // 3. Ottieni distanza richiesta
    const attemptCount = this.escalation.getAttemptCount(deviceFingerprint)
    const requiredDistance = this.escalation.getRequiredDistance(attemptCount)

    // 4. Esegui challenge
    try {
      const result = await this.movement.startMovementChallenge(
        requiredDistance,
        config
      )

      // 5. Incrementa contatore solo se challenge iniziata (non se permessi negati)
      if (result.distanceTraveled > 0 || result.error?.includes("timeout")) {
        this.escalation.incrementAttemptCount(deviceFingerprint)
      }

      return {
        success: result.success,
        fingerprint: deviceFingerprint,
        result,
        attemptCount: attemptCount + 1,
      }
    } catch (error) {
      // Non incrementare contatore per errori di permessi
      throw error
    }
  }

  /**
   * Ottiene le statistiche per il dispositivo corrente
   */
  async getDeviceStats(): Promise<{
    fingerprint: string
    stats: ReturnType<ChallengeEscalation["getStats"]>
  }> {
    const deviceFingerprint = await this.fingerprint.getFingerprint()
    const stats = this.escalation.getStats(deviceFingerprint)

    return {
      fingerprint: deviceFingerprint,
      stats,
    }
  }

  /**
   * Reset manuale per il dispositivo corrente (utile per testing)
   */
  async resetDevice(): Promise<void> {
    const deviceFingerprint = await this.fingerprint.getFingerprint()
    this.escalation.resetAttemptCount(deviceFingerprint)
  }
}
