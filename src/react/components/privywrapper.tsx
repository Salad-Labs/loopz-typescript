"use client"

import { FC } from "react"
import { PrivyWrapperProps } from "../../interfaces/adapter/privywrapperprops"
import { usePrivyLogin } from "../hooks/usePrivyLogin"
import { usePrivyLogout } from "../hooks/usePrivyLogout"
import { usePrivyWallets } from "../hooks/usePrivyWallets"

export const PrivyWrapper: FC<PrivyWrapperProps> = ({ children }) => {
  //used in desktop environment (React, Angular, Vanilla js, Vue)
  //if device is equal to "mobile" for example, inside the hooks there is a check to avoid that these functions will be executed.
  usePrivyLogout()
  usePrivyLogin()
  usePrivyWallets()

  return children
}
