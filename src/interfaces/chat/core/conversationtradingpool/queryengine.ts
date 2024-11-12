import { ListTradesByConversationIdArgs, Maybe } from "../../../../index"
import { ConversationTradingPool, QIError } from "../../../../core/chat"

export interface ConversationTradingPoolQueryEngine {
  listTradesByConversationId(
    args: ListTradesByConversationIdArgs,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<
    | { items: Array<ConversationTradingPool>; nextToken?: Maybe<string> }
    | QIError
  >
  getConversationTradingPoolById(
    conversationTradingPoolId: string,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<ConversationTradingPool | QIError>
}
