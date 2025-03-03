import { OperationResult } from "@urql/core"
import { Message, QIError } from "../../../../core/chat"
import { SubscriptionGarbage } from "../../../../types/chat/subscriptiongarbage"
import {
  Message as MessageGraphQL,
  BatchDeleteMessagesResult as BatchDeleteMessagesResultGraphQL,
} from "../../../../graphql/generated/graphql"

/**
 * Interface for a Message Subscription Engine that provides methods to subscribe to various message-related events.
 * @interface MessageSubscriptionEngine
 */
export interface MessageSubscriptionEngine {
  onSendMessage(
    callback: (
      response: Message | QIError,
      source: OperationResult<
        {
          onSendMessage: MessageGraphQL
        },
        {
          jwt: string
        }
      >,
      uuid: string
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): SubscriptionGarbage | QIError
  onEditMessage(
    callback: (
      response: Message | QIError,
      source: OperationResult<
        {
          onEditMessage: MessageGraphQL
        },
        {
          jwt: string
        }
      >,
      uuid: string
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): SubscriptionGarbage | QIError
  onDeleteMessage(
    callback: (
      response: Message | QIError,
      source: OperationResult<
        {
          onDeleteMessage: MessageGraphQL
        },
        {
          jwt: string
        }
      >,
      uuid: string
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): SubscriptionGarbage | QIError
  onBatchDeleteMessages(
    callback: (
      response: { conversationId: string; messagesIds: string[] } | QIError,
      source: OperationResult<
        {
          onBatchDeleteMessages: BatchDeleteMessagesResultGraphQL
        },
        {
          jwt: string
        }
      >,
      uuid: string
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): SubscriptionGarbage | QIError
  onAddReaction(
    callback: (
      response: Message | QIError,
      source: OperationResult<
        {
          onAddReaction: MessageGraphQL
        },
        {
          jwt: string
        }
      >,
      uuid: string
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): SubscriptionGarbage | QIError
  onRemoveReaction(
    callback: (
      response: Message | QIError,
      source: OperationResult<
        {
          onRemoveReaction: MessageGraphQL
        },
        {
          jwt: string
        }
      >,
      uuid: string
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): SubscriptionGarbage | QIError
  onAddPinMessage(
    callback: (
      response: Message | QIError,
      source: OperationResult<
        {
          onAddPinMessage: MessageGraphQL
        },
        {
          jwt: string
        }
      >,
      uuid: string
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): SubscriptionGarbage | QIError
  onRemovePinMessage(
    callback: (
      response: Message | QIError,
      source: OperationResult<
        {
          onRemovePinMessage: MessageGraphQL
        },
        {
          jwt: string
        }
      >,
      uuid: string
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): SubscriptionGarbage | QIError
}
