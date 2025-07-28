export interface RewardNotification {
  id: string
  userId: string
  type: "xp_gained" | "level_up" | "achievement_unlocked" | "reward_available"
  title: string
  message: string
  data: any
  read: boolean
  createdAt: number
  expiresAt?: number
}
