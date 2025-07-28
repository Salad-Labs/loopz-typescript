export interface VerificationType {
  type: "email" | "phone" | "kyc" | "social" | "biometric" | "custom"
  provider?: string
  required: boolean
  expiresIn?: number
}
