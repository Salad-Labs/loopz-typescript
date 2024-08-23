import { PrivyClientConfig } from "@privy-io/react-auth"
import { DexieStorage } from "../../core/app"
import { Oracle } from "@src/oracle"
import { Order } from "@src/order"
import { Proposal } from "@src/proposal"
import { Chat } from "@src/chat"

/**
 * Represents the configuration for authentication.
 */
export type AuthConfig = {
  storage: DexieStorage
  oracle: Oracle
  order: Order
  proposal: Proposal
  chat: Chat
  privyAppId: string
  privyConfig: PrivyClientConfig
}
