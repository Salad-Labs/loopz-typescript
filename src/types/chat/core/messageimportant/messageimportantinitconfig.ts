/**
 * Represents the initial configuration for an important message.
 * @type MessageImportantInitConfig
 */
import { Client } from "@urql/core"
import { Message } from "../../../../core/chat"
import UUIDSubscriptionClient from "../../../../core/chat/uuidsubscriptionclient"

export type MessageImportantInitConfig = {
  /**
   * @property {string} id - The unique identifier for the important message.
   */
  id: string
  /**
   * @property {string} userId - The user ID associated with the important message.
   */
  userId: string
  /**
   * @property {string} messageId - The ID of the message that is marked as important.
   */
  messageId: string
  /**
   * @property {Message} message - The important message object.
   */
  message: Message
  /**
   * @property {string} conversationId - The ID of the conversation to which the important message belongs.
   */
  conversationId: string
  /**
   * @property {Date} createdAt - The date and time when the important message was created.
   */
  createdAt: Date
  /**
   * @property {Date} updatedAt - The date and time when the message was marked as important.
   */
  updatedAt: Date
  /**
   * @property {Client} client - The URQL client used for communication.
   */
  client: Client
  /**
   * @property {UUIDSubscriptionClient} realtimeClient - The real time client associated with the entry.
   */
  realtimeClient: UUIDSubscriptionClient
}
