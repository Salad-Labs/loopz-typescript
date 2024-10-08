import { Auth } from "@src/auth"
import { Order } from "@src/order"
import { ReactNode } from "react"

export interface PrivyWrapperProps {
  auth: Auth
  order: Order
  children: ReactNode
}
