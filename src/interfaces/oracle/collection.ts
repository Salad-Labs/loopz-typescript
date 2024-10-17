import { Maybe } from "../../types/base"

/**
 * Represents a collection with specific properties.
 * @interface Collection
 */
export interface Collection {
  /**
   * @property {string} assetId - The id of the collection.
   */
  assetId: number
  /**
   * @property {string} collectionAddress - The collection address of the collection.
   */
  collectionAddress: string
  /**
   * @property {Maybe<string>} codeName - The code name of the collection.
   */
  codeName: Maybe<string>
  /**
   * @property {Maybe<string>} assetLogo - The logo URL of the collection.
   */
  assetLogo: Maybe<string>
  /**
   * @property {-1 | 0 | 1 | 2} statusId - The verification status of the collection.
   */
  statusId: -1 | 0 | 1 | 2
  /**
   * @property {Maybe<string>} description - The description of the collection.
   */
  description: Maybe<string>
  /**
   * @property {Maybe<string>} discordURL - The Discord URL of the collection.
   */
  discordURL: Maybe<string>
  /**
   * @property {Maybe<string>} twitterURL - The Twitter URL of the collection.
   */
  twitterURL: Maybe<string>
  /**
   * @property {Maybe<string>} websiteURL - The website URL of the collection.
   */
  websiteURL: Maybe<string>
  /**
   * @property {Maybe<string>} instagramURL - The Instagram URL of the collection.
   */
  instagramURL: Maybe<string>
  /**
   * @property {Maybe<string>} explorerURL - The block explorer URL of the collection.
   */
  explorerURL: Maybe<string>
  /**
   * @property {Maybe<string>} tokenType - The token type of the collection.
   */
  tokenType: Maybe<string>
  /**
   * @property {Maybe<string>} percentageRoyalties - The percentage royalties of the collection.
   */
  percentageRoyalties: Maybe<string>
  /**
   * @property {number} crawled - Determine if the collection is crawled or not.
   */
  crawled: number
  /**
   * @property {Maybe<Date>} updatedAt - A date indicating in which time the collection was updated the last time by the system.
   */
  updatedAt: Maybe<Date>
  /**
   * @property {string} name - The name of the collection.
   */
  name: string
  /**
   * @property {string} networkId - The network ID of the collection.
   */
  networkId: string
  /**
   * @property {Maybe<Array<any>>} abi - The ABI (Application Binary Interface) of the collection.
   */
  abi: Maybe<Array<any>>
  /**
   * @property {ERC721 | ERC1155 | ERC20 | NATIVE} type - The type of the collection.
   */
  type: "ERC721" | "ERC1155" | "ERC20" | "NATIVE"
  /**
   * @property {Maybe<string>} symbol - The symbol of the collection.
   */
  symbol: Maybe<string>
  /**
   * @property {Maybe<string>} createdAt - The creation date of the collection.
   */
  createdAt: Maybe<string>
  /**
   * @property {boolean} isBookmarked - Identifies if the collection is placed in the bookmarked list of the current user.
   */
  isBookmarked?: boolean
  /**
   * @property {boolean} notification - Identifies if the collection is in the notification list of the current user.
   */
  notification?: boolean
}
