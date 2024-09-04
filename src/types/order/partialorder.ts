import { OrderCreated } from "./ordercreated"
/**
 * Represents a partial order instance without the 'hash' property.
 * @extends Order
 */
type PartialOrder = Omit<OrderCreated, "hash"> &
  Partial<Pick<OrderCreated, "hash">>

export { PartialOrder }
