import { Auth } from "@src/auth"
import { Order } from "@src/order"
import { LoopzConfig } from "@src/types/app/loopzconfig"
import { ReactNode } from "react"

export interface LoopzDesktopProviderProps {
  config: LoopzConfig
  auth: Auth
  order: Order
  children: ReactNode
}
