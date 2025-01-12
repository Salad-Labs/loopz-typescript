import { Client } from "@urql/core"
import { Maybe } from "../../../../types/base"
import UUIDSubscriptionClient from "../../../../core/chat/uuidsubscriptionclient"

/**
 * Represents the initial configuration for a message report.
 * @type MessageReportInitConfig
 */
export type MessageReportInitConfig = {
  /**
   * @property {string} id - The unique identifier of the message report.
   */
  id: string
  /**
   * @property {string} description - The description of the message report.
   */
  description: string
  /**
   * @property {Maybe<string>} userId - The optional user ID associated with the message report.
   */
  userId: Maybe<string>
  /**
   * @property {Date} createdAt - The date and time when the message report was created.
   */
  createdAt: Date
  /**
   * @property {Date} updatedAt - The date and time when the message report was updated.
   */
  updatedAt: Date
  /**
   * @property {Client} client - The URQL client used for sending the message report.
   */
  client: Client
  /**
   * @property {UUIDSubscriptionClient} realtimeClient - The real time client associated with the entry.
   */
  realtimeClient: UUIDSubscriptionClient
}
