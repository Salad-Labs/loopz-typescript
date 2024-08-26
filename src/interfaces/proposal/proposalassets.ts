import { ProposalAsset } from "./proposalasset"

/**
 * Represents a collection of proposal assets, including wanted and offered assets.
 * @interface ProposalAssets
 */
export interface ProposalAssets {
  /**
   * @property {ProposalAsset[]} wanted - An array of ProposalAsset objects representing wanted assets.
   */
  wanted?: ProposalAsset[]
  /**
   * @property {ProposalAsset[]} offered - An array of ProposalAsset objects representing offered assets.
   */
  offered?: ProposalAsset[]
}
