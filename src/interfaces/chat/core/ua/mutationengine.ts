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
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<User | QIError>
  createConversationGroup(
    args: CreateConversationGroupArgs,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<
    | {
        keypairItem: KeyPairItem | null
        /* | null is to remove */ conversation: Conversation
      }
    | QIError
  >
  createConversationOneToOne(
    args: CreateConversationOneToOneArgs,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<
    | {
        keypairItem: KeyPairItem | null
        /* | null is to remove */ conversation: Conversation
      }
    | QIError
  >
  deleteBatchConversationMessages(
    args: DeleteBatchConversationMessagesArgs,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<{ conversationId: string; messagesIds: string[] } | QIError>
  eraseConversationByAdmin(
    id: string,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<{ conversationId: string; items: Array<{ id: string }> } | QIError>
  unarchiveConversations(
    ids: Array<string>,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<User | QIError>
  updateUser(
    args: UpdateUserArgs,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<User | QIError>
}
