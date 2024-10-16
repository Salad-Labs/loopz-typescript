"use client"

import React, { useEffect, useRef, useState } from "react"
import { Loopz } from "../../loopz"
import { Auth } from "@src/auth"
import { Order } from "@src/order"
import { Oracle } from "@src/oracle"
import { Proposal } from "@src/proposal"
import { Notification } from "@src/notification"
import { PrivyProvider as PrivyProviderDesktop } from "@privy-io/react-auth"
import { PrivyWrapper } from "./privywrapper"
import {
  ILoopzContext,
  LoopzDesktopProviderProps,
  LoopzProviderProps,
} from "@src/interfaces"
import { LoopzContext } from "../context"
import { Chat } from "@src/chat"

export const LoopzProvider: React.FC<LoopzProviderProps> = ({
  config,
  children,
  devMode,
}) => {
  const initialized = useRef<boolean>(false)
  const authRef = useRef<Auth>()
  const orderRef = useRef<Order>()
  const oracleRef = useRef<Oracle>()
  const proposalRef = useRef<Proposal>()
  const chatRef = useRef<Chat>()
  const notificationRef = useRef<Notification>()

  const [loopzContext, setLoopzContext] = useState<ILoopzContext | null>(null)
  const [loopzInitialized, setLoopzInitialized] = useState<boolean>(false)

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true

      //Loopz.boot(config, false) -> runAdapter arg is false. Why?
      //It is false because we are executing Loopz in a React/React Native context and there is no need to inject a React component in the DOM.
      //in this way we are sure we will handle all the Privy interaction directly from the components defined in this file.
      Loopz.boot(config, {
        runAdapter: false,
        devMode: devMode ? devMode : false,
      }).then(async (loopz: Loopz) => {
        const { auth, order, oracle, proposal, chat, notification } =
          loopz.init()

        authRef.current = auth
        orderRef.current = order
        oracleRef.current = oracle
        proposalRef.current = proposal
        chatRef.current = chat
        notificationRef.current = notification

        setLoopzContext({
          auth,
          order,
          oracle,
          proposal,
          chat,
          notification,
          loopz,
        })
      })
    }
  }, [config])

  useEffect(() => {
    if (loopzContext) setLoopzInitialized(true)
  }, [loopzContext])

  return loopzInitialized ? (
    <LoopzContext.Provider value={loopzContext!}>
      <>
        {loopzInitialized && authRef.current && orderRef.current && (
          <LoopzDesktopProvider
            config={config}
            auth={authRef.current}
            order={orderRef.current}
          >
            {children}
          </LoopzDesktopProvider>
        )}
      </>
    </LoopzContext.Provider>
  ) : (
    <></>
  )
}

const LoopzDesktopProvider: React.FC<LoopzDesktopProviderProps> = ({
  config,
  auth,
  order,
  children,
}) => {
  return (
    <PrivyProviderDesktop
      appId={config.privyAppId}
      config={{
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
        ...config.privyClientConfig,
      }}
    >
      <PrivyWrapper auth={auth} order={order}>
        {children}
      </PrivyWrapper>
    </PrivyProviderDesktop>
  )
}
