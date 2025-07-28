export interface ChallengeResult {
  success: boolean
  distanceTraveled: number
  timeElapsed: number
  averageSpeed: number
  isLikelySpoofed?: boolean
  error?: string
}
