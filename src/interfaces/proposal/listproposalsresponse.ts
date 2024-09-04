import { IProposal } from "./iproposal"
/**
 * Represents the response object when listing proposals.
 * @interface ListProposalsResponse
 */
export interface ListProposalsResponse {
  /**
   * @property {Array<Proposal>} proposals - An array of Proposal instances.
   */
  proposals: Array<IProposal>
  /**
   * @property {number} total - The total number of proposals.
   */
  total: number
}
