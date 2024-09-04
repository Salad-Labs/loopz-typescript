import { Asset } from "../base"
import { ProposalType } from "./proposaltype"
import { ProposalTypeName } from "./proposaltypename"

/**
 * Represents a proposal object with the following properties:
 */
type CreateProposal = {
  /**
   * @property {Object} assets - The assets associated with the proposal.
   */
  assets: {
    /**
     * @property {Asset[]} [wanted] - the wanted assets.
     */
    wanted?: Partial<Asset> & { token: string }[]
    /**
     * @property {Asset[]} [offered] - the offered assets.
     */
    offered?: Partial<Asset> & { token: string }[]
  }
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

export { CreateProposal }
