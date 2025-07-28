export interface RiskMetrics {
  riskScore: number // 0-100
  riskLevel: "low" | "medium" | "high" | "critical"

  // Fattori di rischio
  suspiciousActivity: boolean
  highRiskInteractions: number
  exploitExposure: string[] // contratti exploitati con cui ha interagito

  // Comportamento
  unusualPatterns: string[]
  velocityScore: number // frequenza transazioni anomala

  // Compliance
  sanctionedInteractions: number
  mixerUsage: boolean

  lastRiskAssessment: Date
}
