import { ConversationTradingPoolStatus } from "@src/enums"

export type ListTradesByConversationIdArgs = {
  conversationId: string
  status: ConversationTradingPoolStatus
  nextToken: string
}
