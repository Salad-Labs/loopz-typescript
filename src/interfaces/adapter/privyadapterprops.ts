import { PrivyClientConfig } from "@privy-io/react-auth"
import { Auth } from "../../auth"
import { Order } from "../../order"

export interface PrivyAdapterProps {
  auth: Auth
  order: Order
  appId: string
  config: PrivyClientConfig
}
