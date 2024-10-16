import { Client } from "@urql/core"
import { Conversation } from "../../../../core/chat"
import UUIDSubscriptionClient from "@src/core/chat/uuidsubscriptionclient"

/**
 * Interface for Conversation Pin Initialization Configuration.
 * @type ConversationPinInitConfig
 */
export type ConversationPinInitConfig = {
  /**
   * @property {string} id - The unique identifier for the conversation pin.
   */
  id: string
  /**
   * @property {string} userId - The user ID associated with the conversation pin.
   */
  userId: string
  /**
   * @property {string} conversationId - The ID of the conversation being pinned.
   */
  conversationId: string
  /**
   * @property {Conversation} conversation - The conversation object being pinned.
   */
  conversation: Conversation
  /**
   * @property {Date} createdAt - The date and time when the pin was created.
   */
  createdAt: Date
  /**
   * @property {Date} updatedAt - The date and time when the pin was updated.
   */
  updatedAt: Date
  /**
   * @property {Client} client - The client associated with the conversation pin.
   */
  client: Client
  /**
   * @property {UUIDSubscriptionClient} realtimeClient - The real time client associated with the entry.
   */
  realtimeClient: UUIDSubscriptionClient
}
