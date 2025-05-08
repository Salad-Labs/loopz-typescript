"use client"

import React, { FC, useEffect, useMemo, useRef, useState } from "react"
import { Loopz } from "../../loopz"
import { PrivyClientConfig, PrivyProvider } from "@privy-io/react-auth"
import { PrivyWrapper } from "./privywrapper"
import { LoopzProviderProps } from "../../interfaces"
import { LoopzContext } from "../context/loopzcontext"
import { ILoopzContext } from "../../interfaces/react/iloopzcontext"
import { LoopzAuthProvider } from "./loopzauthprovider"
import { LoopzChatProvider } from "./loopzchatprovider"
import { LoopzAuth } from "./loopzauth"

export const LoopzProvider: FC<LoopzProviderProps> = ({
  config,
  chatConfig,
  devMode = false,
  enableStorage,
  children,
}) => {
  const initialized = useRef(false)

  const [loopz, setLoopz] = useState<ILoopzContext>({
    initialized: false,
    instance: {
      auth: null,
      order: null,
      proposal: null,
      oracle: null,
      chat: null,
      notification: null,
    },
  })

  const privyConfig: PrivyClientConfig = useMemo(() => {
    const { privyClientConfig } = config

    return {
      embeddedWallets: {
        createOnLogin: "users-without-wallets",
      },
      ...privyClientConfig,
    }
  }, [config])

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    //Loopz.boot(config, { runAdapter: false }) -> runAdapter arg is false. Why?
    //It is false because we are executing Loopz in a React context and there is no need to inject a React component in the DOM.
    //in this way we are sure we will handle all the Privy interaction directly from the components defined in this file.
    Loopz.boot(config, {
      devMode,
      runAdapter: false,
      enableStorage,
    }).then((loopz) => setLoopz({ initialized: true, instance: loopz.init() }))
  }, [config, devMode, enableStorage])

  if (!loopz.initialized) return null
  return (
    <LoopzContext.Provider value={loopz}>
      <LoopzAuth
        devMode={devMode}
        intl={config.intl}
        apiKey={config.apiKey}
        logoURL={config.logoURL}
        tosURL={config.tosURL}
        privacyURL={config.privacyURL}
      >
        <LoopzAuthProvider>
          {chatConfig ? (
            <LoopzChatProvider {...chatConfig}>{children}</LoopzChatProvider>
          ) : (
            <>{children}</>
          )}
        </LoopzAuthProvider>
      </LoopzAuth>
    </LoopzContext.Provider>
  )
}
