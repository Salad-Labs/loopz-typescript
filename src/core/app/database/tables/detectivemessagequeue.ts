export interface LocalDBDetectiveMessageQueue {
  id: string
  did: string
  organizationId: string
  conversationId: string
  queue: Array<number>
  processed: boolean
  createdAt: Date
}
