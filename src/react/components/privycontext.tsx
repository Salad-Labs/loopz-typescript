"use client"

import React, { FC, useMemo } from "react"
import { PrivyClientConfig, PrivyProvider } from "@privy-io/react-auth"
import { PrivyAdapterProps } from "@src/interfaces/adapter/privyadapterprops"
import { PrivyWrapper } from "./privywrapper"

export const PrivyContext: FC<PrivyAdapterProps> = ({ appId, config }) => {
  const privyConfig: PrivyClientConfig = useMemo(
    () => ({
      embeddedWallets: {
        createOnLogin: "users-without-wallets",
      },
      ...config,
    }),
    [config]
  )

  return (
    <PrivyProvider appId={appId} config={privyConfig}>
      <PrivyWrapper>
        <></>
      </PrivyWrapper>
    </PrivyProvider>
  )
}
