/**
 * type representing the arguments for listing messages by conversation ID.
 * @type ListMessagesByConversationIdArgs
 */
export type ListMessagesByRangeOrderArgs = {
  /**
   * @property {string} id - The ID of the conversation.
   */
  id: string

  minOrder: number

  maxOrder: number
  /**
   * @property {string} nextToken - Optional. The token for paginating through the list of messages.
   */
  nextToken?: string
}
