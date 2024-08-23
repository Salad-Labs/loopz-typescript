import { BitmapOffered, BitmapWanted, Network } from "../../types/base"
import {
  ProposalStatus,
  ProposalStatusName,
  ProposalType,
  ProposalTypeName,
} from "../../types/proposal"

/**
 * Interface representing filters that can be applied when listing proposals.
 * @interface ListProposalsFilters
 */
export interface ListProposalsFilters {
  /**
   * @property {string | undefined} [owner] - Filters proposals owned by `owner` username or address (optional).
   */
  owner?: string
  /**
   * @property {Array<{ address: string; network: Network }>} [collections] - Filters proposals that contains at least one `collection` address in the relative network (optional).
   *
   * Can be:
   * - An array of addresses and networks
   */
  collections?: Array<{ address: string; network: Network }>
  /**
   * @property {ProposalStatusName | ProposalStatus[ProposalStatusName]} [status] - Filters proposals based on status
   */
  status?: ProposalStatusName | ProposalStatus[ProposalStatusName]
  /**
   * @property {ProposalTypeName | ProposalType[ProposalTypeName]} [type] - Filters proposals based on type
   */
  type?: ProposalTypeName | ProposalType[ProposalTypeName]
  /**
   * @property {BitmapOffered} [typeOffered] - Filters proposals by the BitmapOffered pattern (optional).
   */
  typeOffered?: BitmapOffered
  /**
   * @property {BitmapWanted} [typeWanted] - Filters proposals by the BitmapWanted pattern (optional).
   */
  typeWanted?: BitmapWanted
  /**
   * @property {boolean} [verified] - Filters proposals based on their assets, `verified` returns only proposals with all verified collections (optional).
   */
  verified?: boolean
  /**
   * @property {Network} [network] - Filters proposals based on their network
   */
  network?: Network
  /**
   * @property {number} [offers] - Filters proposals that have at least `offers` number of answers (optional).
   */
  offers?: number
  /**
   * @property {number} [expirationDate] - Filters proposals that are going to expire before or at `expirationDate` timestamp (optional).
   */
  expirationDate?: number
  /**
   * @property {boolean} [includeParent] - Filters proposals that has a parent proposal (optional).
   */
  includeParent?: boolean
}
