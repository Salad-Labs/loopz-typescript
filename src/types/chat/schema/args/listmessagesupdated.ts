/**
 * type representing the arguments for listing messages by conversation ID.
 * @type ListMessagesByConversationIdArgs
 */
export type ListMessagesUpdatedArgs = {
  /**
   * @property {string} id - The ID of the conversation.
   */
  conversationId: string

  greaterThanDate: Date
  /**
   * @property {string} nextToken - Optional. The token for paginating through the list of messages.
   */
  nextToken?: string
}
