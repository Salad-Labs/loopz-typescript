import {
  usePrivyLinkAccount,
  usePrivyLogin,
  usePrivyLogout,
  usePrivyUnlinkAccount,
} from "../../react/hooks"
import { PrivyWrapperProps } from "@src/interfaces"
import React from "react"
import { usePrivyWallets } from "../hooks/usePrivyWallets"

export const PrivyWrapper: React.FC<PrivyWrapperProps> = ({
  auth,
  trade,
  children,
}) => {
  //used in desktop environment (React, Angular, Vanilla js, Vue)
  //if device is equal to "mobile" for example, inside the hooks there is a check to avoid that these functions will be executed.
  usePrivyLogin(auth)
  usePrivyLogout(auth)
  usePrivyLinkAccount(auth)
  usePrivyUnlinkAccount(auth)
  usePrivyWallets(trade)

  return <>{children}</>
}
