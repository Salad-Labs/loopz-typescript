export interface MultiplierCondition {
  type: "time_based" | "achievement_based" | "token_holding" | "custom"
  value: any
}
