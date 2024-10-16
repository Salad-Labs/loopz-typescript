"use client"

import { PrivyProvider } from "@privy-io/react-auth"
import { PrivyAdapterProps } from "@src/interfaces"
import { PrivyWrapper } from "./privywrapper"
import React from "react"

export const PrivyContext: React.FC<PrivyAdapterProps> = ({
  auth,
  order,
  appId,
  config,
}) => {
  return (
    <PrivyProvider
      appId={appId}
      config={{
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
        ...config,
      }}
    >
      <PrivyWrapper auth={auth} order={order}>
        <></>
      </PrivyWrapper>
    </PrivyProvider>
  )
}
