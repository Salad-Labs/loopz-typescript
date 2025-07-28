import {
  ChallengeConfig,
  ChallengeResult,
  MotionData,
  Position,
} from "src/interfaces/antisybil"

export class MovementChallenge {
  private watchId?: number
  private positions: Position[] = []
  private motionData: MotionData[] = []
  private motionActive = false
  private lastMotionTime = 0

  /**
   * Avvia una challenge di movimento
   * @param requiredDistanceMeters Distanza richiesta in metri
   * @param config Configurazione opzionale
   * @returns Risultato della challenge
   */
  async startMovementChallenge(
    requiredDistanceMeters: number,
    config?: ChallengeConfig
  ): Promise<ChallengeResult> {
    // Reset stato
    this.cleanup()

    const startTime = Date.now()
    const timeout = config?.timeoutMs || 300000 // 5 minuti default
    const maxSpeed = config?.maxSpeedMps || 40 // 40 m/s = 144 km/h

    return new Promise<ChallengeResult>((resolve, reject) => {
      // Verifica supporto geolocalizzazione
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"))
        return
      }

      // Setup motion detection se richiesto
      if (config?.motionCheck) {
        this.setupMotionDetection().catch(console.warn)
      }

      let timeoutId: NodeJS.Timeout

      // Handler successo posizione
      const successHandler = (position: GeolocationPosition) => {
        const newPos: Position = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        }

        // Ignora posizioni con accuracy troppo bassa
        if (newPos.accuracy > 50) {
          console.warn("Position accuracy too low:", newPos.accuracy)
          return
        }

        this.positions.push(newPos)

        // Verifica spoofing velocità
        const spoofingDetected = this.detectSpeedSpoofing(maxSpeed)
        if (spoofingDetected) {
          clearTimeout(timeoutId)
          this.cleanup()
          resolve({
            success: false,
            distanceTraveled: this.calculateTotalDistance(),
            timeElapsed: Date.now() - startTime,
            averageSpeed: this.calculateAverageSpeed(),
            isLikelySpoofed: true,
            error: "Movement speed exceeds maximum allowed",
          })
          return
        }

        // Calcola distanza totale
        const totalDistance = this.calculateTotalDistance()

        // Verifica completamento
        if (totalDistance >= requiredDistanceMeters) {
          clearTimeout(timeoutId)
          const isLikelySpoofed = this.analyzeMovementPattern(
            config?.motionCheck
          )

          this.cleanup()
          resolve({
            success: true,
            distanceTraveled: totalDistance,
            timeElapsed: Date.now() - startTime,
            averageSpeed: this.calculateAverageSpeed(),
            isLikelySpoofed,
          })
        }
      }

      // Handler errore
      const errorHandler = (error: GeolocationPositionError) => {
        clearTimeout(timeoutId)
        this.cleanup()

        let errorMessage = "Unknown geolocation error"
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied"
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Position unavailable"
            break
          case error.TIMEOUT:
            errorMessage = "Position timeout"
            break
        }

        reject(new Error(errorMessage))
      }

      // Avvia tracking GPS
      this.watchId = navigator.geolocation.watchPosition(
        successHandler,
        errorHandler,
        {
          enableHighAccuracy: config?.highAccuracy ?? true,
          maximumAge: 0,
          timeout: 5000,
        }
      )

      // Setup timeout
      timeoutId = setTimeout(() => {
        this.cleanup()
        resolve({
          success: false,
          distanceTraveled: this.calculateTotalDistance(),
          timeElapsed: timeout,
          averageSpeed: this.calculateAverageSpeed(),
          error: "Challenge timeout",
        })
      }, timeout)
    })
  }

  /**
   * Calcola la distanza totale percorsa
   */
  private calculateTotalDistance(): number {
    if (this.positions.length < 2) return 0

    let totalDistance = 0
    for (let i = 1; i < this.positions.length; i++) {
      const distance = this.haversineDistance(
        this.positions[i - 1],
        this.positions[i]
      )
      // Ignora piccoli movimenti (rumore GPS)
      if (distance > 1) {
        totalDistance += distance
      }
    }

    return Math.round(totalDistance * 100) / 100 // Arrotonda a 2 decimali
  }

  /**
   * Formula di Haversine per calcolare distanza tra due coordinate
   */
  private haversineDistance(pos1: Position, pos2: Position): number {
    const R = 6371e3 // Raggio della Terra in metri
    const φ1 = (pos1.latitude * Math.PI) / 180
    const φ2 = (pos2.latitude * Math.PI) / 180
    const Δφ = ((pos2.latitude - pos1.latitude) * Math.PI) / 180
    const Δλ = ((pos2.longitude - pos1.longitude) * Math.PI) / 180

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  /**
   * Rileva spoofing basato sulla velocità
   */
  private detectSpeedSpoofing(maxSpeedMps: number): boolean {
    if (this.positions.length < 2) return false

    // Controlla le ultime 5 posizioni per pattern sospetti
    const checkLength = Math.min(5, this.positions.length - 1)
    const startIdx = this.positions.length - checkLength - 1

    for (let i = startIdx; i < this.positions.length - 1; i++) {
      const distance = this.haversineDistance(
        this.positions[i],
        this.positions[i + 1]
      )
      const timeDiff =
        (this.positions[i + 1].timestamp - this.positions[i].timestamp) / 1000

      if (timeDiff === 0) continue // Evita divisione per zero

      const speed = distance / timeDiff

      // Velocità sospetta
      if (speed > maxSpeedMps) {
        console.warn(`Suspicious speed detected: ${speed.toFixed(2)} m/s`)
        return true
      }

      // Salto improvviso (teletrasporto)
      if (distance > 100 && timeDiff < 2) {
        console.warn(
          `Teleportation detected: ${distance.toFixed(2)}m in ${timeDiff}s`
        )
        return true
      }
    }

    return false
  }

  /**
   * Setup del rilevamento movimento tramite sensori
   */
  private async setupMotionDetection(): Promise<void> {
    // Verifica supporto API
    if (!("DeviceMotionEvent" in window)) {
      console.warn("DeviceMotionEvent not supported")
      return
    }

    // Richiedi permesso su iOS 13+
    if (typeof (DeviceMotionEvent as any).requestPermission === "function") {
      try {
        const permission = await (DeviceMotionEvent as any).requestPermission()
        if (permission !== "granted") {
          console.warn("Motion permission denied")
          return
        }
      } catch (error) {
        console.warn("Motion permission error:", error)
        return
      }
    }

    window.addEventListener("devicemotion", this.handleMotion)
  }

  /**
   * Handler per eventi di movimento
   */
  private handleMotion = (event: DeviceMotionEvent): void => {
    if (!event.acceleration) return

    const motion: MotionData = {
      acceleration: {
        x: event.acceleration.x || 0,
        y: event.acceleration.y || 0,
        z: event.acceleration.z || 0,
      },
      timestamp: Date.now(),
    }

    this.motionData.push(motion)

    // Mantieni solo ultimi 100 campioni
    if (this.motionData.length > 100) {
      this.motionData.shift()
    }

    // Rileva movimento significativo
    const magnitude = Math.sqrt(
      motion.acceleration.x ** 2 +
        motion.acceleration.y ** 2 +
        motion.acceleration.z ** 2
    )

    if (magnitude > 1.5) {
      // Soglia per movimento camminata
      this.motionActive = true
      this.lastMotionTime = Date.now()
    }
  }

  /**
   * Analizza il pattern di movimento per rilevare spoofing
   */
  private analyzeMovementPattern(checkMotion?: boolean): boolean {
    // Se non abbiamo abbastanza dati, non possiamo determinare
    if (this.positions.length < 5) return false

    // Analisi 1: Movimento troppo lineare (GPS simulato tende ad essere perfetto)
    const linearityScore = this.calculateLinearityScore()
    if (linearityScore > 0.98) {
      console.warn("Movement too linear:", linearityScore)
      return true
    }

    // Analisi 2: Velocità costante innaturale
    const speedVariance = this.calculateSpeedVariance()
    if (speedVariance < 0.1) {
      console.warn("Speed too constant:", speedVariance)
      return true
    }

    // Analisi 3: Motion check (se abilitato)
    if (checkMotion && this.motionData.length > 10) {
      const motionScore = this.calculateMotionScore()
      const timeSinceLastMotion = Date.now() - this.lastMotionTime

      // Se c'è movimento GPS ma nessun movimento rilevato dai sensori
      if (motionScore < 0.1 && timeSinceLastMotion > 5000) {
        console.warn("No motion detected despite GPS movement")
        return true
      }
    }

    return false
  }

  /**
   * Calcola quanto il percorso è lineare (0-1)
   */
  private calculateLinearityScore(): number {
    if (this.positions.length < 3) return 0

    const start = this.positions[0]
    const end = this.positions[this.positions.length - 1]
    const directDistance = this.haversineDistance(start, end)
    const actualDistance = this.calculateTotalDistance()

    if (actualDistance === 0) return 0

    return directDistance / actualDistance
  }

  /**
   * Calcola la varianza della velocità
   */
  private calculateSpeedVariance(): number {
    if (this.positions.length < 3) return 1

    const speeds: number[] = []
    for (let i = 1; i < this.positions.length; i++) {
      const distance = this.haversineDistance(
        this.positions[i - 1],
        this.positions[i]
      )
      const timeDiff =
        (this.positions[i].timestamp - this.positions[i - 1].timestamp) / 1000
      if (timeDiff > 0) {
        speeds.push(distance / timeDiff)
      }
    }

    if (speeds.length === 0) return 1

    const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length
    const variance =
      speeds.reduce((acc, speed) => {
        return acc + Math.pow(speed - avgSpeed, 2)
      }, 0) / speeds.length

    return variance
  }

  /**
   * Calcola un punteggio di movimento basato sui dati del sensore
   */
  private calculateMotionScore(): number {
    if (this.motionData.length === 0) return 0

    const recentMotion = this.motionData.slice(-20)
    let totalMagnitude = 0

    for (const motion of recentMotion) {
      const magnitude = Math.sqrt(
        motion.acceleration.x ** 2 +
          motion.acceleration.y ** 2 +
          motion.acceleration.z ** 2
      )
      totalMagnitude += magnitude
    }

    return totalMagnitude / recentMotion.length
  }

  /**
   * Calcola la velocità media
   */
  private calculateAverageSpeed(): number {
    if (this.positions.length < 2) return 0

    const totalDistance = this.calculateTotalDistance()
    const totalTime =
      (this.positions[this.positions.length - 1].timestamp -
        this.positions[0].timestamp) /
      1000

    if (totalTime === 0) return 0

    return Math.round((totalDistance / totalTime) * 100) / 100
  }

  /**
   * Pulizia risorse
   */
  private cleanup(): void {
    if (this.watchId !== undefined) {
      navigator.geolocation.clearWatch(this.watchId)
      this.watchId = undefined
    }

    window.removeEventListener("devicemotion", this.handleMotion)

    this.positions = []
    this.motionData = []
    this.motionActive = false
    this.lastMotionTime = 0
  }
}
