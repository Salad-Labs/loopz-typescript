import { Client } from "@urql/core"
import UUIDSubscriptionClient from "../../../../core/chat/uuidsubscriptionclient"

/**
 * Represents the initialization configuration for a conversation member.
 * @type ConversationMemberInitConfig
 */
export type ConversationMemberInitConfig = {
  /**
   * @property {string} id - The unique identifier of the conversation member.
   */
  id: string
  /**
   * @property {string} conversationId - The ID of the conversation the member belongs to.
   */
  conversationId: string
  /**
   * @property {string} userId - The ID of the user who is a member of the conversation.
   */
  userId: string
  /**
   * @property {"USER" | "ADMINISTRATOR"} type - The type of the conversation member (either "USER" or "ADMINISTRATOR").
   */
  type: "USER" | "ADMINISTRATOR"
  /**
   * @property {string} encryptedConversationPublicKey - The public key used for encryption in the conversation.
   */
  encryptedConversationPublicKey: string
  /**
   * @property {string} encryptedConversationPrivateKey - The private key used for encryption in the conversation.
   */
  encryptedConversationPrivateKey: string
  /**
   * @property {Date} createdAt - The optional creation date of the client.
   */
  createdAt: Date
  /**
   * @property { Date} updatedAt - The updated date of the current object.
   */
  updatedAt: Date
  /**
   * @property {Client} client - The client object.
   */
  client: Client
  /**
   * @property {UUIDSubscriptionClient} realtimeClient - The real time client associated with the entry.
   */
  realtimeClient: UUIDSubscriptionClient
}
