import { ListTradesByConversationIdArgs, Maybe } from "../../../../index"
import { ConversationTradingPool, QIError } from "../../../../core/chat"

export interface ConversationTradingPoolQueryEngine {
  listTradesByConversationId(
    args: ListTradesByConversationIdArgs
  ): Promise<
    | { items: Array<ConversationTradingPool>; nextToken?: Maybe<string> }
    | QIError
  >
  getConversationTradingPoolById(
    conversationTradingPoolId: string
  ): Promise<ConversationTradingPool | QIError>
}
