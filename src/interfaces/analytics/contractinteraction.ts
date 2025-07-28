export interface ContractInteraction {
  address: string
  name?: string
  category?: "defi" | "nft" | "gaming" | "dao" | "other"
  interactionCount: number
  lastInteraction: Date
  methods: string[]
}
