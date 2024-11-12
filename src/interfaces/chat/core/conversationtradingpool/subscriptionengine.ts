import { OperationResult } from "@urql/core"
import { ConversationTradingPool, QIError } from "../../../../core/chat"
import { SubscriptionGarbage } from "../../../../types/chat/subscriptiongarbage"
import {
  ConversationTradingPool as ConversationTradingPoolGraphQL,
  SubscriptionOnDeleteRequestTradeArgs,
  SubscriptionOnRequestTradeArgs,
  SubscriptionOnUpdateRequestTradeArgs,
} from "../../../../graphql/generated/graphql"

/**
 * Interface for a Conversation Trading Pool Subscription Engine that handles
 * trade requests and deletions.
 * @interface ConversationTradingPoolSubscriptionEngine
 */
export interface ConversationTradingPoolSubscriptionEngine {
  onRequestTrade(
    conversationId: string,
    callback: (
      response: QIError | ConversationTradingPool,
      source: OperationResult<
        { onRequestTrade: ConversationTradingPoolGraphQL },
        SubscriptionOnRequestTradeArgs & { jwt: string }
      >,
      uuid: string
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): QIError | SubscriptionGarbage
  onDeleteRequestTrade(
    conversationId: string,
    callback: (
      response: QIError | ConversationTradingPool,
      source: OperationResult<
        { onDeleteRequestTrade: ConversationTradingPoolGraphQL },
        SubscriptionOnDeleteRequestTradeArgs & { jwt: string }
      >,
      uuid: string
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): QIError | SubscriptionGarbage
  onUpdateRequestTrade(
    conversationId: string,
    callback: (
      response: QIError | ConversationTradingPool,
      source: OperationResult<
        { onUpdateRequestTrade: ConversationTradingPoolGraphQL },
        SubscriptionOnUpdateRequestTradeArgs & { jwt: string }
      >,
      uuid: string
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): QIError | SubscriptionGarbage
}
