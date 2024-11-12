import { ListTradesByConversationIdArgs, Maybe } from "../../../../index"
import { ConversationTradingPool, QIError } from "../../../../core/chat"

export interface ConversationTradingPoolQueryEngine {
  listTradesByConversationId(
    args: ListTradesByConversationIdArgs,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<
    | { items: Array<ConversationTradingPool>; nextToken?: Maybe<string> }
    | QIError
  >
  getConversationTradingPoolById(
    conversationTradingPoolId: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<ConversationTradingPool | QIError>
}
