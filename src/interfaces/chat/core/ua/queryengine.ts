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
  FindUsersByUsernameOrAddressArgs,
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
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<
    | {
        items: Array<string>
        nextToken?: String
      }
    | QIError
  >
  listConversationsByIds(
    ids: Array<string>,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<
    { items: Array<Conversation>; unprocessedKeys?: Maybe<string[]> } | QIError
  >
  listMessagesByConversationId(
    args: ListMessagesByConversationIdArgs,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<{ items: Array<Message>; nextToken?: Maybe<string> } | QIError>
  listMessagesImportantByUserConversationId(
    args: ListMessagesImportantByUserConversationIdArgs,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<
    { items: Array<MessageImportant>; nextToken?: Maybe<string> } | QIError
  >
  listMessagesByRangeOrder(
    args: ListMessagesByRangeOrderArgs,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<{ items: Array<Message>; nextToken?: Maybe<string> } | QIError>
  listConversationsPinnedByCurrentUser(
    nextToken?: string,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<
    { items: Array<ConversationPin>; nextToken?: Maybe<string> } | QIError
  >
  listUsersByIds(
    ids: Array<string>,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<
    { items: Array<User>; unprocessedKeys?: Maybe<string[]> } | QIError
  >
  getConversationById(
    id: string,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<Conversation | QIError>
  findUsersByUsernameOrAddress(
    args: FindUsersByUsernameOrAddressArgs,
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<{ items: Array<User>; nextToken?: String } | QIError>
  getCurrentUser(
    overrideHandlingUnauthoraizedQIError?: boolean
  ): Promise<User | QIError>
}
