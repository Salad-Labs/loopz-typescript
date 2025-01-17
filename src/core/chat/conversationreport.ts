import { ConversationReportInitConfig } from "../../types/chat/core/conversationreport"
import { ConversationReportSchema } from "../../interfaces/chat/schema"
import { Maybe } from "../../types/base"
import { Engine } from "./engine"
import { EngineInitConfig } from "../../types"

/**
 * Represents a Conversation Report that extends the Engine class and implements the ConversationReportSchema interface.
 * @class ConversationReport
 * @extends Engine
 * @implements ConversationReportSchema
 */

export class ConversationReport
  extends Engine
  implements ConversationReportSchema
{
  /**
   * @property id - The unique identifier of the item.
   */
  readonly id: string
  /**
   * @property description - The optional description of the item.
   */
  readonly description: Maybe<string>
  /**
   * @property userId - The optional user id associated with the item.
   */
  readonly userId: Maybe<string>
  /**
   * @property createdAt - The timestamp when the item was created.
   */
  readonly createdAt: Date
  /**
   * @property updatedAt - The timestamp when the item was updated.
   */
  readonly updatedAt: Date

  /**
   * Constructor for creating a ConversationReport object with the given configuration.
   * @param {ConversationReportInitConfig & EngineInitConfig} config - The configuration object containing JWT token, API key, API URLs, user key pair, key pairs map, id, description, user ID, creation timestamp, and client.
   * @returns None
   */
  constructor(config: ConversationReportInitConfig & EngineInitConfig) {
    super({
      storage: config.storage,
      devMode: config.devMode,
    })

    this.id = config.id
    this.description = config.description
    this.userId = config.userId
    this.createdAt = config.createdAt
    this.updatedAt = config.updatedAt

    this._client = config.client
    this._realtimeClient = config.realtimeClient
  }
}
