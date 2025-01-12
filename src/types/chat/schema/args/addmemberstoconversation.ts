/**
 * type for adding members to a conversation.
 * @type AddMembersToConversationArgs
 */
export type AddMembersToConversationArgs = {
  /**
   * @property {string} id - The ID of the conversation.
   */
  id: string
  /**
   * @property {Array} membersIds - An array of objects containing member details:
   * - memberId: The ID of the member.
   * - encryptedConversationIVKey: The encrypted iv key for the conversation.
   * - encryptedConversationAESKey: The encrypted AES key for the conversation.
   */
  members: Array<{
    memberId: string
    encryptedConversationIVKey: string
    encryptedConversationAESKey: string
  }>
}
