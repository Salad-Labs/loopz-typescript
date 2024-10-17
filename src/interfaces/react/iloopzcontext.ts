import { Auth } from "../../auth"
import { Chat } from "../../chat"
import { Oracle } from "../../oracle"
import { Proposal } from "../../proposal"
import { Order } from "../../order"
import { Notification } from "../../notification"

export type ILoopzContext =
  | {
      initialized: false
      instance: {
        auth: null
        order: null
        proposal: null
        oracle: null
        chat: null
        notification: null
      }
    }
  | {
      initialized: true
      instance: {
        auth: Auth
        order: Order
        proposal: Proposal
        oracle: Oracle
        chat: Chat
        notification: Notification
      }
    }
