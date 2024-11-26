import { Network } from "../../base"

/**
 * Represents the parameters for searching collections.
 */
type ListBookmarkedCollectionsArgs = {
  /**
   * @property {number} skip - The number of items to skip in the search results.
   */
  skip: number
  /**
   * @property {number} take - The number of items to take in the search results.
   */
  take: number
  /**
   * @property {string} [networkId] - Optional network ID for the search.
   */
  networkId?: Network
}

export { ListBookmarkedCollectionsArgs }
