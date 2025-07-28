export interface AirdropRecipient {
  address: string
  amount: bigint
  index?: number
  proof?: string[]
  metadata?: any
}
