export interface RewardAction {
  id: string
  name: string
  experiencePoints: number
  isOnChain: boolean
  contractAddress?: string
  eventSignature?: string
  cooldown?: number
  maxDaily?: number
  validation?: any
}
