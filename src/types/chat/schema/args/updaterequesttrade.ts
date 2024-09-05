import { ConversationTradingPoolStatus } from "@src/enums"

/**
 * Represents the arguments needed to update a request a trade.
 * @type UpdateRequestTradeArgs
 */
export type UpdateRequestTradeArgs = {
  conversationTradingPoolId: string
  status: ConversationTradingPoolStatus
  orderId?: string
}
