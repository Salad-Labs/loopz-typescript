import { SoulBoundTokenMetadata } from "./soulboundtokenmetadata"

export interface TokenUpdateRequest {
  tokenId: number
  updates: Partial<SoulBoundTokenMetadata>
  signature?: string // Per aggiornamenti off-chain verificati
}
