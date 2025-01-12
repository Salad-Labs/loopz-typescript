import { Conversation, QIError, User } from "../../../../core/chat"
import { KeyPairItem } from "../../../../types/chat/keypairitem"
import {
  CreateConversationGroupArgs,
  CreateConversationOneToOneArgs,
  DeleteBatchConversationMessagesArgs,
  UpdateUserArgs,
} from "../../../../types/chat/schema/args"

/**
 * Interface for a User Activity Mutation Engine that defines methods for mutating conversations and users.
 * @interface UAMutationEngine
 */
export interface UAMutationEngine {
  archiveConversations(
    ids: Array<string>,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<User | QIError>
  createConversationGroup(
    args: CreateConversationGroupArgs,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<
    | {
        keypairItem: KeyPairItem | null
        /* | null is to remove */ conversation: Conversation
      }
    | QIError
  >
  createConversationOneToOne(
    args: CreateConversationOneToOneArgs,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<
    | {
        keypairItem: KeyPairItem | null
        /* | null is to remove */ conversation: Conversation
      }
    | QIError
  >
  deleteBatchConversationMessages(
    args: DeleteBatchConversationMessagesArgs,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<{ conversationId: string; messagesIds: string[] } | QIError>
  eraseConversationByAdmin(
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<{ conversationId: string; items: Array<{ id: string }> } | QIError>
  unarchiveConversations(
    ids: Array<string>,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<User | QIError>
  updateUser(
    args: UpdateUserArgs,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<User | QIError>
}
