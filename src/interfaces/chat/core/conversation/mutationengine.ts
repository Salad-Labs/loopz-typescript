import {
  Conversation,
  ConversationMember,
  ConversationReport,
  Message,
  QIError,
  User,
} from "../../../../core/chat"
import {
  AddMembersToConversationArgs,
  AddReportToConversationArgs,
  EjectMemberArgs,
  MuteConversationArgs,
  SendMessageArgs,
  UpdateConversationGroupInputArgs,
} from "../../../../types/chat/schema/args"

/**
 * Interface for a Conversation Mutation Engine that defines methods for mutating conversations.
 * @interface ConversationMutationEngine
 */
export interface ConversationMutationEngine {
  addMembersToConversation(
    args: AddMembersToConversationArgs,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<
    { conversationId: string; items: Array<ConversationMember> } | QIError
  >
  addReportToConversation(
    args: AddReportToConversationArgs,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<ConversationReport | QIError>
  archiveConversation(
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<User | QIError>
  archiveConversation(
    id: string,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<User | QIError>
  deleteMessage(
    id: string,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<Message | QIError>
  ejectMember(
    args: EjectMemberArgs,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<
    | { conversationId: string; conversation: Conversation; memberOut: User }
    | QIError
  >
  leaveConversation(
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<
    | { conversationId: string; conversation: Conversation; memberOut: User }
    | QIError
  >
  leaveConversation(
    id: string,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<
    | { conversationId: string; conversation: Conversation; memberOut: User }
    | QIError
  >
  muteConversation(
    args: MuteConversationArgs,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<Conversation | QIError>
  sendMessage(
    args: SendMessageArgs,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<Message | QIError>
  unarchiveConversation(
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<User | QIError>
  unarchiveConversation(
    id: string,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<User | QIError>
  unmuteConversation(
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<Conversation | QIError>
  unmuteConversation(
    id: string,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<Conversation | QIError>
  updateConversationGroup(
    args: UpdateConversationGroupInputArgs,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<Conversation | QIError>
  pinConversation(
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<Conversation | QIError>
  pinConversation(
    id: string,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<Conversation | QIError>
  unpinConversation(
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<boolean | QIError>
  unpinConversation(
    id: string,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<boolean | QIError>
}
