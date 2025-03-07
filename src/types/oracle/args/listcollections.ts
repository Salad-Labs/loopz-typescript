import { Network } from "../../base"

/**
 * Represents the parameters for searching collections.
 */
type ListCollectionsArgs = {
  /**
   * @property {"NFT" | "TKN" | "ALL"} searchType - The type of search to perform ("NFT", "TKN", or "ALL").
   */
  searchType: "NFT" | "TKN" | "ALL"
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
  /**
   * @property {string} [queryString] - Optional query string for additional search parameters.
   */
  queryString?: string
}

export { ListCollectionsArgs }
