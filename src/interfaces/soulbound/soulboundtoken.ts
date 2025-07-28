import { SoulBoundTokenMetadata } from "./soulboundtokenmetadata"

export interface SoulBoundToken {
  tokenId: number
  owner: string
  metadata: SoulBoundTokenMetadata
  uri: string
  bound: boolean
  createdAt: number
  version: number
}
