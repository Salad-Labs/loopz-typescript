import { Collector } from "."
import { Asset, Maybe } from "../../types/base"
import { ProposalStatus } from "../../types/proposal/proposalstatus"
import { ProposalStatusName } from "../../types/proposal/proposalstatusname"
import { ProposalType } from "../../types/proposal/proposaltype"
import { ProposalTypeName } from "../../types/proposal/proposaltypename"

/**
 * Represents a proposal instance with various properties.
 */
type IProposal = {
  /**
   * @property {string} id - The unique identifier of the proposal.
   */
  id: string
  /**
   * @property {Maybe<string>} parentId - The identifier of the parent proposal, if any.
   */
  parentId: Maybe<string>
  /**
   * @property {ProposalStatus[ProposalStatusName]} status - The status of the proposal.
   */
  status: ProposalStatus[ProposalStatusName]
  /**
   * @property {ProposalType[ProposalTypeName]} type - The type of the proposal.
   */
  type: ProposalType[ProposalTypeName]
  /**
   * @property {number} creationDate - The timestamp of when the proposal was created.
   */
  creationDate: number
  /**
   * @property {string} networkId - The network identifier of the proposal.
   */
  networkId: string
  /**
   * @property {Collector} creator - The creator of the proposal.
   */
  creator: Collector
  /**
   * @property {Array<{ type: string }>} messages -
   */
  messages: Array<{ type: string }>
  /**
   * @property {ProposalAssets} assets - The assets associated with the proposal.
   */
  assets: {
    /**
     * @property {Partial<Asset> & { token: string }[]} [wanted] - the wanted assets.
     */
    wanted?: Partial<Asset> & { token: string }[]
    /**
     * @property {Partial<Asset> & { token: string }[]} [offered] - the offered assets.
     */
    offered?: Partial<Asset> & { token: string }[]
  }
  /**
   * @property {boolean} isCreator - Indicates if the user is the creator of the proposal.
   */
  isCreator?: boolean
  /**
   * @property {string} [typeWanted] - The type of item wanted in the proposal.
   */
  typeWanted?: string
  /**
   * @property {string} [typeOffered] - The type of item offered in the proposal.
   */
  typeOffered?: string
  /**
   * @property {boolean} [accepted] - Indicates if the proposal is accepted.
   */
  accepted?: boolean
  /**
   * @property {number} [expirationDate] - The expiration date of the proposal.
   */
  expirationDate?: Maybe<number>
  /**
   * @property {Maybe<IProposal>} [parent] - The parent proposal instance, if any.
   */
  parent?: Maybe<IProposal>
}

export { IProposal }
