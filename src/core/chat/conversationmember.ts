import { ConversationMemberInitConfig } from "../../types/chat/core/conversationmember"
import { ConversationMemberSchema } from "../../interfaces/chat/schema"
import { Engine } from "./engine"
import { EngineInitConfig } from "../../types"

/**
 * Represents a conversation member in the chat system.
 * @class ConversationMember
 * @extends Engine
 * @implements ConversationMemberSchema
 */

export class ConversationMember
  extends Engine
  implements ConversationMemberSchema
{
  /**
   * @property {string} id - The unique identifier of the conversation.
   */
  readonly id: string
  /**
   * @property {string} conversationId - The identifier of the conversation, if available.
   */
  readonly conversationId: string
  /**
   * @property {string} userId - The user ID associated with the conversation.
   */
  readonly userId: string
  /**
   * @property {"USER" | "ADMINISTRATOR"} type - The type of the conversation, either "USER" or "ADMINISTRATOR".
   */
  readonly type: "USER" | "ADMINISTRATOR"
  /**
   * @property {string} encryptedConversationAESKey - The AES key used for encryption in the conversation.
   */
  readonly encryptedConversationAESKey: string
  /**
   * @property {string} encryptedConversationIVeKey - The IV key used for encryption in the conversation.
   */
  readonly encryptedConversationIVKey: string
  /**
   * @property {Date} createdAt - The date and time when the conversation was
   */
  readonly createdAt: Date
  /**
   * @property {Date} createdAt - The date and time when the conversation was
   */
  readonly updatedAt: Date

  /**
   * Constructor for creating a ConversationMember object with the given configuration.
   * @param {ConversationMemberInitConfig & EngineInitConfig} config - The configuration object containing initialization parameters.
   * @returns None
   */
  constructor(config: ConversationMemberInitConfig & EngineInitConfig) {
    super({
      storage: config.storage,
      devMode: config.devMode,
    })

    this.id = config.id
    this.conversationId = config.conversationId
    this.userId = config.userId
    this.type = config.type
    this.encryptedConversationIVKey = config.encryptedConversationIVKey
    this.encryptedConversationAESKey = config.encryptedConversationAESKey
    this.createdAt = config.createdAt
    this.updatedAt = config.updatedAt

    this._client = config.client
    this._realtimeClient = config.realtimeClient
  }
}
