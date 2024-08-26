import { ReplyProposalAssets } from "../../interfaces/proposal"

/**
 * Represents a proposal reply object with the following properties:
 */
type ProposalReplyObject = {
  /**
   * @property {string} creatorAddress - The address of the creator of the proposal reply.
   */
  creatorAddress: string
  /**
   * @property {Array<{ type: string }>} messages - An array of message objects with a type property.
   */
  messages: Array<{ type: string }>
  /**
   * @property {ReplyProposalAssets} assets - The assets associated with the proposal reply.
   */
  assets: ReplyProposalAssets
  /**
   * @property {string} networkId - The network ID of the proposal reply.
   */
  networkId: string
  /**
   * @property {string} parentId - The ID of the parent proposal that this reply is associated with.
   */
  parentId: string
}

export { ProposalReplyObject }
