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
import { LoopzChatContextValue } from "../../types/react/loopzchatcontextvalue"

export const LoopzChatProvider: FC<
  LoopzProviderChatConfig & { children?: ReactNode }
> = ({ autoConnect, autoSync, children }) => {
  const { instance, initialized } = useLoopz()
  const { isAuthenticated } = useLoopzAuth()
  const hasStartedConnection = useRef(false)
  const hasStartedSynchronization = useRef(false)
  const [chatStatus, setChatStatus] = useState({
    isConnecting: true,
    isConnected: false,
    isSynching: false,
    isSynched: false,
  })

  const setIsConnected = useCallback(
    (isConnected: boolean) => setChatStatus((cs) => ({ ...cs, isConnected })),
    []
  )

  const setIsSynched = useCallback(
    (isSynched: boolean) => setChatStatus((cs) => ({ ...cs, isSynched })),
    []
  )

  useEffect(() => {
    if (
      !initialized ||
      !isAuthenticated ||
      chatStatus.isConnected ||
      hasStartedConnection.current
    )
      return
    hasStartedConnection.current = true

    if (!autoConnect)
      return setChatStatus({
        isConnecting: false,
        isConnected: false,
        isSynching: false,
        isSynched: false,
      })

    instance.chat
      .connect()
      .then(() =>
        setChatStatus({
          isConnecting: false,
          isConnected: true,
          isSynching: autoSync ?? false,
          isSynched: false,
        })
      )
      .catch(() => {
        hasStartedConnection.current = false
        setChatStatus({
          isConnecting: false,
          isConnected: false,
          isSynching: false,
          isSynched: false,
        })
      })
  }, [
    initialized,
    isAuthenticated,
    chatStatus,
    autoConnect,
    instance,
    autoSync,
  ])

  useEffect(() => {
    if (
      !initialized ||
      !chatStatus.isConnected ||
      chatStatus.isSynched ||
      hasStartedSynchronization.current
    )
      return
    hasStartedSynchronization.current = true

    if (!autoSync)
      return setChatStatus({
        isConnecting: false,
        isConnected: true,
        isSynching: false,
        isSynched: false,
      })

    instance.chat
      .sync()
      .then(() =>
        setChatStatus({
          isConnecting: false,
          isConnected: true,
          isSynching: false,
          isSynched: true,
        })
      )
      .catch(() => {
        hasStartedSynchronization.current = false
        setChatStatus({
          isConnecting: false,
          isConnected: true,
          isSynching: false,
          isSynched: false,
        })
      })
  }, [initialized, chatStatus, autoSync, instance])

  useEffect(() => {
    if (autoConnect || !autoSync) return

    console.warn(
      "[LoopzProvider]: chatConfig.autoSync has no effect because chatConfig.autoConnect is false"
    )
  }, [autoConnect, autoSync])

  return (
    <LoopzChatContext.Provider
      value={
        { ...chatStatus, setIsConnected, setIsSynched } as LoopzChatContextValue
      }
    >
      {children}
    </LoopzChatContext.Provider>
  )
}
