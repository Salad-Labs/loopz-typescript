import { Asset } from "../../../index"

/**
 * Represents the arguments needed to request a trade.
 * @type RequestTradeArgs
 */
export type RequestTradeArgs = {
  /**
   * @property {Array<string>} involvedUsers - The array of users IDs involved in the trade.
   */
  involvedUsers: Array<string>
  /**
   * @property {string} conversationId - The ID of the conversation related to the trade.
   */
  conversationId: string
  /**
   * @property {JSON} operation - The JSON object representing the trade operation.
   */
  operation: {
    operation: string
    creatorDid: string
    counterpartyDid: string
    creatorAddress: string
    counterpartyAddress: string
    organizationId: string
    networkId: string
    assets: {
      participantOne: Array<Asset>
      participantTwo: Array<Asset>
    }
    orderId?: string
  }
}
