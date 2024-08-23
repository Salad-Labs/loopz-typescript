import { PrivyClientConfig } from "@privy-io/react-auth"
import { Auth } from "@src/auth"
import { Order } from "@src/order"

export interface PrivyAdapterProps {
  auth: Auth
  order: Order
  appId: string
  config: PrivyClientConfig
}
