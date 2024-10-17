import { Network } from "@ethersproject/providers"

/**
 * Defines the parameters for searching NFTs.
 */
type ListNFTsByCollectionArgs = {
  /**
   * @property {Network} networkId - The network ID for the NFTs.
   */
  networkId: Network
  /**
   * @property {string} collectionAddress - The collection to search for NFTs.
   */
  collectionAddress: string
  /**
   * @property {string} address - The address to search for NFTs.
   */
  address: string
  /**
   * @property {number} take - The number of NFTs to retrieve.
   */
  take: number
  /**
   * @property {string} [continuation] - Optional continuation token for pagination.
   */
  continuation?: string
}

export { ListNFTsByCollectionArgs }
