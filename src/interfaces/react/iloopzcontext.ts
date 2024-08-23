import { Auth } from "@src/auth"
import { Chat } from "@src/chat"
import { Loopz } from "@src/loopz"
import { Oracle } from "@src/oracle"
import { Proposal } from "@src/proposal"
import { Order } from "@src/order"

export interface ILoopzContext {
  loopz: Loopz
  auth: Auth
  order: Order
  proposal: Proposal
  oracle: Oracle
  chat: Chat
}
