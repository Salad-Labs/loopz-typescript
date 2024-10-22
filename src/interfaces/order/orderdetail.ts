import { AssetStatusVerification, Maybe } from "../.."
import { AssetTypeName } from "../../types/base/assettypename"
/**
 * Represents a detailed object with various properties related to a collection.
 */
export type OrderDetail = {
  /**
   * @property {Maybe<string>} blc - The BLC property, possibly a string.
   */
  blc: Maybe<string>
  /**
   * @property {number} blcNative - The native BLC value as a number.
   */
  blcNative: number
  /**
   * @property {string} blcPercentage - The BLC percentage as a string.
   */
  blcPercentage: string
  /**
   * @property {number} blcPercentageNative - The native BLC percentage as a number.
   */
  blcPercentageNative: number
  /**
   * @property {string} token - The address of the collection.
   */
  token: string
  /**
   * @property {string} collectionLogo - The URL of the collection's logo.
   */
  collectionLogo: string
  /**
   * @property {boolean} creator - The creator identifier.
   */
  creator: boolean
  /**
   * Represents a token with the following properties:
   * @property {string} networkId - The network ID of the token.
   */
  networkId: string
  /**
   * @property {string} imageUrl - The URL of the token's image.
   */
  imageUrl: string
  /**
   * @property {boolean} isImg - Indicates whether the token has an image (0 for no, 1 for yes).
   */
  isImg: boolean
  /**
   * @property {Maybe<string>} name - The name of the token, or null if not available.
   */
  name: Maybe<string>
  /**
   * @property {AssetStatusVerification} statusVerification - The verification status of the token.
   */
  statusVerification: AssetStatusVerification
  /**
   * @property {string} orderId - The order ID of the token.
   */
  orderId: string
  /**
   * @property {string} symbol - The symbol of the token.
   */
  symbol: string
  /**
   * @property {Maybe<string>} tokenId - The ID of the token, can be null.
   */
  identifier: Maybe<string>
  /**
   * @property {number} tokenUSDValue - The USD value of the token.
   */
  tokenUSDValue: number
  /**
   * @property {AssetTypeName} type - The type of the token.
   */
  type: AssetTypeName
}
