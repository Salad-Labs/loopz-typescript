export interface PerkReward {
  id: string
  type: "fee_discount" | "early_access" | "voting_power" | "custom"
  value: any
  duration?: number // in secondi
}
