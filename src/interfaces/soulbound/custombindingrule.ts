import { SoulBoundTokenMetadata } from "./soulboundtokenmetadata"

export interface CustomBindingRule {
  id: string
  description: string
  validator: (metadata: SoulBoundTokenMetadata) => Promise<boolean>
}
