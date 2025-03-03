import { OperationResult } from "@urql/core"
import { ConversationTradingPool, QIError } from "../../../../core/chat"
import { SubscriptionGarbage } from "../../../../types/chat/subscriptiongarbage"
import { ConversationTradingPool as ConversationTradingPoolGraphQL } from "../../../../graphql/generated/graphql"

/**
 * Interface for a Conversation Trading Pool Subscription Engine that handles
 * trade requests and deletions.
 * @interface ConversationTradingPoolSubscriptionEngine
 */
export interface ConversationTradingPoolSubscriptionEngine {
  onRequestTrade(
    callback: (
      response: QIError | ConversationTradingPool,
      source: OperationResult<
        { onRequestTrade: ConversationTradingPoolGraphQL },
        { jwt: string }
      >,
      uuid: string
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): QIError | SubscriptionGarbage
  onDeleteRequestTrade(
    callback: (
      response: QIError | ConversationTradingPool,
      source: OperationResult<
        { onDeleteRequestTrade: ConversationTradingPoolGraphQL },
        { jwt: string }
      >,
      uuid: string
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): QIError | SubscriptionGarbage
  onUpdateRequestTrade(
    callback: (
      response: QIError | ConversationTradingPool,
      source: OperationResult<
        { onUpdateRequestTrade: ConversationTradingPoolGraphQL },
        { jwt: string }
      >,
      uuid: string
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): QIError | SubscriptionGarbage
}
