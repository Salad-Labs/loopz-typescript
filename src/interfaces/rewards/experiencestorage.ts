import { Leaderboard } from "./leaderboard"
import { RewardEvent } from "./rewardevent"
import { UserExperience } from "./userexperience"
import { UserStatistics } from "./userstatistics"

export interface IExperienceStorage {
  saveUserExperience(userId: string, experience: UserExperience): Promise<void>
  getUserExperience(userId: string): Promise<UserExperience | null>
  saveRewardEvent(event: RewardEvent): Promise<void>
  getRewardHistory(
    userId: string,
    limit?: number,
    offset?: number
  ): Promise<RewardEvent[]>
  updateLeaderboard(
    period: "daily" | "weekly" | "monthly" | "all-time"
  ): Promise<void>
  getLeaderboard(
    period: "daily" | "weekly" | "monthly" | "all-time",
    limit?: number
  ): Promise<Leaderboard>
  incrementStatistic(
    userId: string,
    stat: keyof UserStatistics,
    value: number
  ): Promise<void>
}
