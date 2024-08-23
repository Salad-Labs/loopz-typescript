import { Asset } from "../base"
/**
 * Represents a order asset with optional additional properties.
 * @returns {OrderAsset<Additional>} A order asset object with optional additional properties.
 */
type OrderAsset<Additional extends Record<string, any> = {}> = {
  /**
   * @property {Array<Asset>} assets - An array of assets associated with the order (NATIVE/ERC20/ERC721/ERC1155).
   */
  assets?: Array<Asset>
} & Additional

export { OrderAsset }
