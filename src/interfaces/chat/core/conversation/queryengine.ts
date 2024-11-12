import { QIError, User } from "../../../../core/chat"

/**
 * Interface for a Conversation Query Engine that defines a method to retrieve the owner of the conversation.
 * @interface ConversationQueryEngine
 */
export interface ConversationQueryEngine {
  owner(overrideHandlingUnauthorizedQIError?: boolean): Promise<User | QIError>
}
