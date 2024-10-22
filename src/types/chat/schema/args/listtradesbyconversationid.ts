import { ConversationTradingPoolStatus } from "../../../../enums"

export type ListTradesByConversationIdArgs = {
  conversationId: string
  status: ConversationTradingPoolStatus
  nextToken: string
}
