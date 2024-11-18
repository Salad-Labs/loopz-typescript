import { ConversationTradingPool, QIError } from "../../../../core/chat"
import { RequestTradeArgs, UpdateRequestTradeArgs } from "../../../../types"

/**
 * Interface for a Conversation Trading Pool Mutation Engine, which defines methods for
 * deleting a request trade and requesting a trade.
 * @interface ConversationTradingPoolMutationEngine
 */
export interface ConversationTradingPoolMutationEngine {
  deleteRequestTrade(
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<ConversationTradingPool | QIError>
  requestTrade(
    args: RequestTradeArgs,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<ConversationTradingPool | QIError>
  updateRequestTrade(
    args: UpdateRequestTradeArgs,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<ConversationTradingPool | QIError>
}
