import { OperationResult } from "@urql/core"
import {
  Conversation,
  ConversationMember,
  QIError,
  User,
} from "../../../../core/chat"
import { SubscriptionGarbage } from "../../../../types/chat/subscriptiongarbage"
import {
  Conversation as ConversationGraphQL,
  ListConversationMembers as ListConversationMembersGraphQL,
  MemberOutResult as MemberOutResultGraphQL,
} from "../../../../graphql/generated/graphql"

/**
 * Interface for managing subscriptions related to conversations.
 * @interface ConversationSubscriptionEngine
 */
export interface ConversationSubscriptionEngine {
  onUpdateConversationGroup(
    callback: (
      response: QIError | Conversation,
      source: OperationResult<
        { onUpdateConversationGroup: ConversationGraphQL },
        { jwt: string }
      >,
      uuid: string
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): QIError | SubscriptionGarbage
  onEjectMember(
    callback: (
      response:
        | QIError
        | {
            conversationId: string
            conversation: Conversation
            memberOut: User
          },
      source: OperationResult<
        { onEjectMember: MemberOutResultGraphQL },
        { jwt: string }
      >,
      uuid: string
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): QIError | SubscriptionGarbage
  onLeaveConversation(
    callback: (
      response:
        | QIError
        | {
            conversationId: string
            conversation: Conversation
            memberOut: User
          },
      source: OperationResult<
        { onLeaveConversation: MemberOutResultGraphQL },
        { jwt: string }
      >,
      uuid: string
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): QIError | SubscriptionGarbage
  onMuteConversation(
    callback: (
      response: QIError | Conversation,
      source: OperationResult<
        { onMuteConversation: ConversationGraphQL },
        { jwt: string }
      >,
      uuid: string
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): QIError | SubscriptionGarbage
  onUnmuteConversation(
    callback: (
      response: QIError | Conversation,
      source: OperationResult<
        { onUnmuteConversation: ConversationGraphQL },
        { jwt: string }
      >,
      uuid: string
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): QIError | SubscriptionGarbage
  onAddPinConversation(
    callback: (
      response: QIError | Conversation,
      source: OperationResult<
        { onAddPinConversation: ConversationGraphQL },
        { jwt: string }
      >,
      uuid: string
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): QIError | SubscriptionGarbage
  onRemovePinConversation(
    callback: (
      response: QIError | Conversation,
      source: OperationResult<
        { onRemovePinConversation: ConversationGraphQL },
        { jwt: string }
      >,
      uuid: string
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): QIError | SubscriptionGarbage
  onAddMembersToConversation(
    callback: (
      response:
        | QIError
        | {
            conversationId: string
            items: Array<ConversationMember>
            membersIds: Array<string>
          },
      source: OperationResult<
        { onAddMembersToConversation: ListConversationMembersGraphQL },
        { jwt: string }
      >,
      uuid: string
    ) => void,
    overrideHandlingUnauthorizedQIError?: boolean
  ): QIError | SubscriptionGarbage
}
