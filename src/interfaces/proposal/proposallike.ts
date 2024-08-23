import { Maybe } from "../../types/base"
import { Collector } from "./collector"
import { ReplyProposalAssets } from "./replyproposalassets"
import { ProposalStatus } from "../../types/proposal/proposalstatus"
import { ProposalStatusName } from "../../types/proposal/proposalstatusname"
import { ProposalType } from "../../types/proposal/proposaltype"
import { ProposalTypeName } from "../../types/proposal/proposaltypename"

/**
 * Represents a proposal like object with various properties.
 * @interface ProposalLike
 */
export interface ProposalLike {
  /**
   * @property {string} id - The unique identifier of the proposal like.
   */
  id: string
  /**
   * @property {Maybe<string>} parentId - The optional parent ID of the proposal like.
   */
  parentId: Maybe<string>
  /**
   * @property {ProposalStatus[ProposalStatusName]} status - The status of the proposal like.
   */
  status: ProposalStatus[ProposalStatusName]
  /**
   * @property {ProposalType[ProposalTypeName]} type - The type of the proposal like.
   */
  type: ProposalType[ProposalTypeName]
  /**
   * @property {number} creationDate - The timestamp of when the proposal like was created.
   */
  creationDate: number
  /**
   * @property {string} networkId - The network ID associated with the proposal like.
   */
  networkId: string
  /**
   * @property {Collector} creator - The creator of the proposal like.
   */
  creator: Collector
  /**
   * @property {Array<{type: string}>} messages -
   */
  messages: Array<{ type: string }>
  /**
   * @property {ReplyProposalAssets} assets - The assets attached to the reply proposal.
   */
  assets: ReplyProposalAssets
  /**
   * @property {string} typeWanted - The type of item the proposaler is looking for.
   */
  typeWanted: string
  /**
   * @property {string} typeOffered - The type of item the proposaler is offering.
   */
  typeOffered: string
  /**
   * @property {Maybe<number>} expirationDate - The expiration date of the reply proposal, if specified.
   */
  expirationDate: Maybe<number>
}
