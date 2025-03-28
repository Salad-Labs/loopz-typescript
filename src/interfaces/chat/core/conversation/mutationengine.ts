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
  CreateConversationGroupArgs,
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
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<
    { conversationId: string; items: Array<ConversationMember> } | QIError
  >
  addReportToConversation(
    args: AddReportToConversationArgs,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<ConversationReport | QIError>
  archiveConversation(
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<User | QIError>
  archiveConversation(
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<User | QIError>
  deleteMessage(
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Message | QIError>
  ejectMember(
    args: EjectMemberArgs,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<
    | { conversationId: string; conversation: Conversation; memberOut: User }
    | QIError
  >
  leaveConversation(
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<
    | { conversationId: string; conversation: Conversation; memberOut: User }
    | QIError
  >
  leaveConversation(
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<
    | { conversationId: string; conversation: Conversation; memberOut: User }
    | QIError
  >
  muteConversation(
    args: MuteConversationArgs,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Conversation | QIError>
  sendMessage(
    args: SendMessageArgs,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Message | QIError>
  unarchiveConversation(
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<User | QIError>
  unarchiveConversation(
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<User | QIError>
  unmuteConversation(
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Conversation | QIError>
  unmuteConversation(
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Conversation | QIError>
  updateConversationGroup(
    args: UpdateConversationGroupInputArgs,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Conversation | QIError>
  pinConversation(
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Conversation | QIError>
  pinConversation(
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Conversation | QIError>
  unpinConversation(
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<boolean | QIError>
  unpinConversation(
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<boolean | QIError>
  createPublicConversation?(
    args: CreateConversationGroupArgs & {
      conversationKeys: {
        conversationAESKey: string
        conversationIVKey: string
      }
    },
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<{ conversationId: string; conversation: Conversation } | QIError>
  joinConversation?(
    args: {
      conversationId: string
      encryptedConversationAESKey: string
      encryptedConversationIVKey: string
    },
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Conversation | QIError>
}
