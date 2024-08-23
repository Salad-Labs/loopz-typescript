import { ReplyProposalAssets } from "../../interfaces/proposal"
import { ProposalType } from "./proposaltype"
import { ProposalTypeName } from "./proposaltypename"

/**
 * Represents a proposal object with the following properties:
 */
type ProposalObject = {
  /**
   * @property {CreateProposalAssets} assets - The assets associated with the proposal.
   */
  assets: ReplyProposalAssets
  /**
   * @property {number} expirationDate - The expiration date of the proposal.
   */
  expirationDate: number
  /**
   * @property {Array<{ type: string }>} messages - An array of message types associated with the proposal.
   */
  messages: Array<{ type: string }>
  /**
   * @property {string} networkId - The network ID of the proposal.
   */
  networkId: string
  /**
   * @property {ProposalType[ProposalTypeName]} type - The type of the proposal based on ProposalType and ProposalTypeName.
   */
  type: ProposalType[ProposalTypeName]
  /**
   * @property {string} creatorAddress - The address of the creator of the proposal.
   */
  creatorAddress: string
}

export { ProposalObject }
