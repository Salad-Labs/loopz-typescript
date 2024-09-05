import { Asset } from "@src/types/base"
import { MessageType } from "../../../../enums/chat/messagetype"

/**
 * Represents the arguments needed to send a message in a conversation.
 * @type SendMessageArgs
 */
export type SendMessageArgs = {
  /**
   * @property {string} conversationId - The ID of the conversation to send the message to.
   */
  conversationId: string
  /**
   * @property {string} content - The content of the message to send.
   */
  content: string | { assets: Asset[]; message: string }
  /**
   * @property {MessageType} type - The type of message being sent.
   */
  type: MessageType
}
