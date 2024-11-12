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
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<ConversationTradingPool | QIError>
  requestTrade(
    args: RequestTradeArgs,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<ConversationTradingPool | QIError>
  updateRequestTrade(
    args: UpdateRequestTradeArgs,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<ConversationTradingPool | QIError>
}
