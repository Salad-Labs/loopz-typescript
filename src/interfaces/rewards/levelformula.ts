export interface LevelFormula {
  type: "linear" | "exponential" | "custom"
  baseXP: number
  multiplier: number
  customFormula?: (level: number) => number
}
