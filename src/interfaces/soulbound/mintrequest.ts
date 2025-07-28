import { SoulBoundTokenMetadata } from "./soulboundtokenmetadata"
import { VerificationProof } from "./verificationproof"

export interface MintRequest {
  to: string
  initialMetadata: Partial<SoulBoundTokenMetadata>
  verifications?: VerificationProof[]
}
