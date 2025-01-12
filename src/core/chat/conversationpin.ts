import { ConversationPinInitConfig } from "../../types/chat/core/conversationpin"
import { ConversationPinSchema } from "../../interfaces/chat/schema"
import { Conversation } from "./conversation"
import { Engine } from "./engine"
import { EngineInitConfig } from "../../types"

/**
 * Represents a Conversation Pin object that extends the Engine class and implements the ConversationPinSchema interface.
 * @class ConversationPin
 * @extends Engine
 * @implements ConversationPinSchema
 */

export class ConversationPin extends Engine implements ConversationPinSchema {
  /**
   * @property id - The unique identifier of the pin.
   */
  readonly id: string
  /**
   * @property userId - The user ID associated with the pin.
   */
  readonly userId: string
  /**
   * @property conversationId - The ID of the conversation the pin belongs to.
   */
  readonly conversationId: string
  /**
   * @property createdAt - The date and time when the pin was created.
   */
  readonly createdAt: Date
  /**
   * @property updatedAt - The date and time when the pin was updated.
   */
  readonly updatedAt: Date
  /**
   * @property conversation - The conversation object that the pin is a part of.
   */
  readonly conversation: Conversation

  /**
   * Constructor for ConversationPin class that initializes the object with the provided configuration.
   * @param {ConversationPinInitConfig & EngineInitConfig} config - The configuration object containing necessary parameters.
   * @returns None
   */
  constructor(config: ConversationPinInitConfig & EngineInitConfig) {
    super({
      storage: config.storage,
      devMode: config.devMode,
    })

    this.id = config.id
    this.userId = config.userId
    this.conversationId = config.conversationId
    this.conversation = config.conversation
    this.createdAt = config.createdAt
    this.updatedAt = config.updatedAt

    this._client = config.client
    this._realtimeClient = config.realtimeClient
  }
}
