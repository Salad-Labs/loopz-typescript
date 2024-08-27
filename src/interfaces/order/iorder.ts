import { Maybe } from "../../types/base"
import { Collector } from "../proposal"

/**
 * Represents a order order with detailed information about the order.
 * @interface IOrder
 */
export interface IOrder {
  /**
   * @property {string} networkId - The network ID of the order.
   */
  networkId: string
  /**
   * @property {string} orderId - The unique identifier of the order.
   */
  orderId: string
  /**
   * @property {0 | 1 | 2} orderStatus - The status of the order (0 - pending, 1 - completed, 2 - cancelled).
   */
  orderStatus: 0 | 1 | 2
  /**
   * @property {string} txHash - The transaction hash of the order.
   */
  txHash: string
  /**
   * @property {string} addressMaker - The address of the maker in the order.
   */
  addressMaker: string
  /**
   * @property {Maybe<string>} usernameMaker - The username of the maker (optional).
   */
  usernameMaker: Maybe<string>
  /**
   * @property {string} valueMaker - The value
   */
  valueMaker: string
  /**
   * @property {string} addressTaker - The address of the taker in the order.
   */
  addressTaker: string
  /**
   *@property {Maybe<string>} usernameTaker - The username of the taker, if available.
   */
  usernameTaker: Maybe<string>
  /**
   *@property {string} valueTaker - The value taken in the order.
   */
  valueTaker: string
  /**
   *@property {string} name - The name of the order.
   */
  name: string
  /**
   *@property {string} symbol - The symbol of the order.
   */
  symbol: string
  /**
   *@property {string} imageUrl - The URL of the image associated with the order.
   */
  imageUrl: string
  /**
   *@property {string} start - The start of the order in the order.
   */
  start: string
  /**
   * @property {string} end - The end of the order in the order
   */
  end: string
  /**
   *  @property {Array<Collector>} maker - An array of collectors representing the makers of the order.
   */
  maker: Array<Collector>
  /**
   * @property {Array<Collector>} taker - An array of collectors representing the takers of the order.
   */
  taker: Array<Collector>
  /**
   * @property {Array<{creator: boolean, networkId: string, collectionAddress: string, abi: Array<any>, name: string, symbol: string, assetLogo: string, type: "ERC721" | "ERC1155" | "ERC20" | "NATIVE", statusVerification: -1 | 0 | 1 | 2}>} collections - An array of collections
   */
  collections: Array<{
    creator: boolean
    networkId: string
    collectionAddress: string
    abi: Array<any>
    name: string
    symbol: string
    assetLogo: string
    type: "ERC721" | "ERC1155" | "ERC20" | "NATIVE"
    statusVerification: -1 | 0 | 1 | 2
  }>
}
