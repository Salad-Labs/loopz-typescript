export interface AchievementData {
  id: string
  name: string
  unlockedAt: number
  tier: "bronze" | "silver" | "gold" | "platinum" | "diamond"
}
