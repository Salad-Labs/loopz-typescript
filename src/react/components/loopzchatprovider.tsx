"use client"

import React, {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import { useLoopz, useLoopzAuth } from "../hooks"
import { LoopzChatContext } from "../context/loopzchatcontext"
import { LoopzProviderChatConfig } from "../../types/react/loopzproviderchatconfig"

export const LoopzChatProvider: FC<
  LoopzProviderChatConfig & { children?: ReactNode }
> = ({ autoConnect, children }) => {
  const { instance, initialized } = useLoopz()
  const { account } = useLoopzAuth()
  const hasStartedConnection = useRef(false)
  const [connectedStatus, setConnectedStatus] = useState({ isConnected: false })

  const setIsConnected = useCallback(
    (isConnected: boolean) =>
      setConnectedStatus((cs) => ({ ...cs, isConnected })),
    []
  )

  useEffect(() => {
    if (
      !initialized ||
      !account ||
      !autoConnect ||
      connectedStatus.isConnected ||
      hasStartedConnection.current
    )
      return
    hasStartedConnection.current = true

    instance.chat
      .connect()
      .then(() => setConnectedStatus({ isConnected: true }))
      .catch(() => {
        hasStartedConnection.current = false
        setConnectedStatus({ isConnected: false })
      })
  }, [initialized, account, autoConnect, connectedStatus, instance])

  return (
    <LoopzChatContext.Provider value={{ ...connectedStatus, setIsConnected }}>
      {children}
    </LoopzChatContext.Provider>
  )
}
