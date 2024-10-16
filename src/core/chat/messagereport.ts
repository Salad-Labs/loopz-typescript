import { MessageReportInitConfig } from "../../types/chat/core/messagereport"
import { MessageReportSchema } from "../../interfaces/chat/schema"
import { Maybe } from "../../types/base"
import { Engine } from "./engine"
import { EngineInitConfig } from "../../types"

/**
 * Represents a Message Report engine that extends the Engine class and implements the MessageReportSchema interface.
 * @class MessageReport
 * @extends Engine
 * @implements MessageReportSchema
 */

export class MessageReport extends Engine implements MessageReportSchema {
  /**
   * @property id - The unique identifier of the item.
   */
  readonly id: string
  /**
   * @property description - The description of the item.
   */
  readonly description: string
  /**
   * @property userId - The user ID associated with the item, if available.
   */
  readonly userId: Maybe<string>
  /**
   * @property createdAt - The date and time when the item was created.
   */
  readonly createdAt: Date
  /**
   * @property updatedAt - The date and time when the item was updated.
   */
  readonly updatedAt: Date

  /**
   * Constructor for creating a new instance of a MessageReportInitConfig & EngineInitConfig object.
   * @param {MessageReportInitConfig & EngineInitConfig} config - The configuration object containing message report and engine initialization settings.
   * @returns None
   */
  constructor(config: MessageReportInitConfig & EngineInitConfig) {
    super({
      apiKey: config.apiKey,
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
