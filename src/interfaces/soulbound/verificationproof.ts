import { VerificationType } from "./verificationtype"

export interface VerificationProof {
  type: VerificationType["type"]
  proof: string
  timestamp: number
  signature: string
}
