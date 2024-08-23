import { Collector, ProposalAssets } from "../../interfaces/proposal"
import { Maybe } from "../base"
import { ProposalStatus } from "./proposalstatus"
import { ProposalStatusName } from "./proposalstatusname"
import { ProposalType } from "./proposaltype"
import { ProposalTypeName } from "./proposaltypename"

/**
 * Represents a proposal instance with various properties.
 */
type ProposalItem = {
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
  assets: ProposalAssets
  /**
   * @property {boolean} isCreator - Indicates if the user is the creator of the proposal.
   */
  isCreator: boolean
  /**
   * @property {number} [score] - The score of the proposal.
   */
  score?: number
  /**
   * @property {boolean} [isDifferent] - Indicates if the proposal is different from others.
   */
  isDifferent?: boolean
  /**
   * @property {number} [like] - The number of likes on the proposal.
   */
  like?: number
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
  expirationDate?: number
  /**
   * @property {number} [numberOffers] - The number of offers for the proposal.
   */
  numberOffers?: number
  /**
   * @property {number} [numberOffersRead] - The number of offers read for the proposal.
   */
  numberOffersRead?: number
  /**
   * @property {Maybe<ProposalItem>} [parent] - The parent proposal instance, if any.
   */
  parent?: Maybe<ProposalItem>
}

export { ProposalItem }
