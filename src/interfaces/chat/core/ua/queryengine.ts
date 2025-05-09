import { ListMessagesUpdatedArgs } from "../../../../types/chat/schema/args/listmessagesupdated"
import {
  Conversation,
  ConversationPin,
  Message,
  MessageImportant,
  QIError,
  User,
} from "../../../../core/chat"
import {
  Maybe,
  FindUsersByUsernameArgs,
  ListAllActiveUserConversationIdsArgs,
  ListMessagesByConversationIdArgs,
  ListMessagesByRangeOrderArgs,
  ListMessagesImportantByUserConversationIdArgs,
} from "../../../../types"

/**
 * Interface for a User Query Engine that provides methods to interact with user conversations and messages.
 * @interface UAQueryEngine
 */
export interface UAQueryEngine {
  listAllActiveUserConversationIds(
    args: ListAllActiveUserConversationIdsArgs,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<
    | {
        items: Array<string>
        nextToken?: String
      }
    | QIError
  >
  listConversationsByIds(
    ids: Array<string>,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<
    { items: Array<Conversation>; unprocessedKeys?: Maybe<string[]> } | QIError
  >
  listMessagesByConversationId(
    args: ListMessagesByConversationIdArgs,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<{ items: Array<Message>; nextToken?: Maybe<string> } | QIError>
  listMessagesImportantByUserConversationId(
    args: ListMessagesImportantByUserConversationIdArgs,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<
    { items: Array<MessageImportant>; nextToken?: Maybe<string> } | QIError
  >
  listMessagesByRangeOrder(
    args: ListMessagesByRangeOrderArgs,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<{ items: Array<Message>; nextToken?: Maybe<string> } | QIError>
  listMessagesUpdated(
    args: ListMessagesUpdatedArgs,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<{ items: Array<Message>; nextToken?: Maybe<string> } | QIError>
  listConversationsPinnedByCurrentUser(
    nextToken?: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<
    { items: Array<ConversationPin>; nextToken?: Maybe<string> } | QIError
  >
  listUsersByIds(
    ids: Array<string>,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<
    { items: Array<User>; unprocessedKeys?: Maybe<string[]> } | QIError
  >
  getConversationById(
    id: string,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<Conversation | QIError>
  findUsersByUsername(
    args: FindUsersByUsernameArgs,
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<{ items: Array<User>; nextToken?: String } | QIError>
  getCurrentUser(
    overrideHandlingUnauthorizedQIError?: boolean
  ): Promise<User | QIError>
}
