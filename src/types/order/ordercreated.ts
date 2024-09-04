import { OrderWithCounter } from "@opensea/seaport-js/lib/types"
/**
 * Represents a order instance which extends the OrderWithCounter type from the @opensea/seaport-js library.
 * It includes an additional property 'hash' of type string.
 */
type OrderCreated = OrderWithCounter & { hash: string }

export { OrderCreated }
