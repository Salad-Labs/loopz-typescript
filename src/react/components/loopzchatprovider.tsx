"use client"

import React, { FC, ReactNode, useEffect, useRef, useState } from "react"
import { useLoopz, useLoopzAuth } from "../hooks"
import { LoopzChatContext } from "../context/loopzchatcontext"

export const LoopzChatProvider: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const { instance, initialized } = useLoopz()
  const [{ account }] = useLoopzAuth()
  const hasStartedConnection = useRef(false)
  const [connectedStatus, setConnectedStatus] = useState({ isConnected: false })

  useEffect(() => {
    if (
      !initialized ||
      !account ||
      connectedStatus.isConnected ||
      hasStartedConnection.current
    )
      return
    hasStartedConnection.current = true

    // TODO (improvement) make it optional by using a prop to let users decide whether to auto connect on render or call manually
    instance.chat
      .connect()
      .then(() => setConnectedStatus({ isConnected: true }))
      .catch(() => {
        hasStartedConnection.current = false
        setConnectedStatus({ isConnected: false })
      })
  }, [initialized, account, connectedStatus, instance])

  return (
    <LoopzChatContext.Provider value={connectedStatus}>
      {children}
    </LoopzChatContext.Provider>
  )
}
