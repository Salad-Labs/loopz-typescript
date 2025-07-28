import { LeaderboardEntry } from "./leaderbordentry"

export interface Leaderboard {
  period: "daily" | "weekly" | "monthly" | "all-time"
  entries: LeaderboardEntry[]
  lastUpdated: number
  totalParticipants: number
}
