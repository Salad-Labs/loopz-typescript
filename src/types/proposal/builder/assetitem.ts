import { ProposalAsset } from "../../../interfaces/proposal"

/**
 * Represents an item extracted from a PostAsset object, containing specific properties.
 */
type AssetItem = Pick<
  ProposalAsset,
  "address" | "networkId" | "type" | "tokenId" | "amount"
>

export { AssetItem }
