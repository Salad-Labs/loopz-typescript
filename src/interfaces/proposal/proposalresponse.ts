import { ProposalItem } from "../../types/proposal"
/**
 * Represents the response object for a proposal request.
 */
export interface ProposalResponse {
  /**
   * @property {ProposalItem} proposal - the proposal attached with the response.
   */
  proposal: ProposalItem
}
