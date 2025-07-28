export interface ReputationData {
  score: number // 0-1000
  trustLevel: "beginner" | "verified" | "trusted" | "elite"
  violations: number
  endorsements: number
  lastCalculated: number
}
