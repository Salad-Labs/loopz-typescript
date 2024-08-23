import { OrderInstance } from "./orderinstance"
/**
 * Represents a partial order instance without the 'hash' property.
 * @extends Order
 */
type PartialOrder = Omit<OrderInstance, "hash"> &
  Partial<Pick<OrderInstance, "hash">>

export { PartialOrder }
