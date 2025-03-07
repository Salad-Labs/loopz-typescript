import { Client } from "@urql/core"
import { Maybe } from "../../../../types/base"
import UUIDSubscriptionClient from "../../../../core/chat/uuidsubscriptionclient"

/**
 * Represents the configuration for initializing a conversation trading pool.
 * @type ConversationTradingPoolInitConfig
 */
export type ConversationTradingPoolInitConfig = {
  /**
   * @property {string} id - The unique identifier for the trading pool.
   */
  id: string
  /**
   * @property {Maybe<string>} conversationId - The ID of the conversation associated with the trading pool.
   */
  conversationId: Maybe<string>
  /**
   * @property {Maybe<string>} userId - The ID of the user associated with the trading pool.
   */
  userId: Maybe<string>
  /**
   * @property {Maybe<Array<string>>} involvedUsers - An array of user IDs who are creators of the trading pool.
   */
  involvedUsers: Maybe<Array<string>>
  /**
   * @property {Maybe<string>} operation - The JSON object representing the operation of the trading pool.
   */
  operation: Maybe<string>
  /**
   * @property {Maybe<"TRADE_INITIALIZED" | "TRADE_PROGRESS" | "TRADE_COMPLETED" | "TRADE_ALL">} status - The status of the trade.
   */
  status: Maybe<
    "TRADE_INITIALIZED" | "TRADE_PROGRESS" | "TRADE_COMPLETED" | "TRADE_ALL"
  >
  /**
   * @property {Maybe<"RENT" | "TRADE">} type - The type of trade.
   */
  type: Maybe<"RENT" | "TRADE">
  /**
   * @property {Maybe<Date>} createdAt - The date and time when the trade was created.
   */
  createdAt: Maybe<Date>
  /**
   * @property {Maybe<Date>} updatedAt - The date and time when the trade was last updated.
   */
  updatedAt: Maybe<Date>
  /**
   * @property {Maybe<Date>} deletedAt - The date and time when the trade was deleted.
   */
  deletedAt: Maybe<Date>
  /**
   * @property {Client} client - The client associated with the trade.
   */
  client: Client
  /**
   * @property {UUIDSubscriptionClient} realtimeClient - The real time client associated with the entry.
   */
  realtimeClient: UUIDSubscriptionClient
}
