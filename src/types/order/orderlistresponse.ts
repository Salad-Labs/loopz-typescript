import { IOrder } from "@src/index"

/**
 * Represents the response object for the global orders list.
 * @interface OrderListResponse
 */
export interface OrderListResponse {
  /**
   * @property {Array<IOrder>} orderList - An array of IOrder objects representing the orders.
   */
  orders: Array<IOrder>
  /**
   * @property {number} count - The total count of orders in the list.
   */
  total: number
}
