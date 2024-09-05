import { OrderCreated } from "./ordercreated"
/**
 * Represents a partial order instance without the 'hash' property.
 * @extends Order
 */
type PartialOrder = Omit<OrderCreated, "hash" | "orderId"> &
  Partial<Pick<OrderCreated, "hash" | "orderId">>

export { PartialOrder }
