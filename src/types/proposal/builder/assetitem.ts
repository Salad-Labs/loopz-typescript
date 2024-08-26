import { ProposalAsset } from "../../../interfaces/proposal"

/**
 * Represents an item extracted from a ProposalAsset object, containing specific properties.
 */
type AssetItem = Pick<
  ProposalAsset,
  "address" | "networkId" | "type" | "tokenId" | "amount"
>

export { AssetItem }
