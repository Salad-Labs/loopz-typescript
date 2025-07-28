export interface ProgressData {
  category: "experience" | "achievement" | "stats" | "reputation" | "custom"
  action: string
  value: any
  timestamp: number
  metadata?: Record<string, any>
}
