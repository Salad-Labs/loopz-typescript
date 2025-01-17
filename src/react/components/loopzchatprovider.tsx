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
    canChat: false,
    isConnecting: false,
    isConnected: false,
    isSyncing: false,
    isSynced: false,
  })

  const setCanChat = useCallback(
    (canChat: boolean) => setChatStatus((cs) => ({ ...cs, canChat })),
    []
  )

  const setIsConnected = useCallback(
    (isConnected: boolean) => setChatStatus((cs) => ({ ...cs, isConnected })),
    []
  )

  const setIsSynced = useCallback(
    (isSynched: boolean) => setChatStatus((cs) => ({ ...cs, isSynched })),
    []
  )

  useEffect(() => {
    if (!initialized) return

    setCanChat(instance.chat.clientCanChat())
  }, [initialized, instance])

  useEffect(() => {
    if (
      !initialized ||
      !isAuthenticated ||
      !autoConnect ||
      chatStatus.isConnected ||
      !chatStatus.canChat ||
      hasStartedConnection.current
    )
      return
    hasStartedConnection.current = true

    setChatStatus({
      canChat: true,
      isConnecting: true,
      isConnected: false,
      isSyncing: false,
      isSynced: false,
    })

    instance.chat
      .connect()
      .then(() =>
        setChatStatus({
          canChat: true,
          isConnecting: false,
          isConnected: true,
          isSyncing: autoSync ?? false,
          isSynced: false,
        })
      )
      .catch(() => {
        hasStartedConnection.current = false
        setChatStatus({
          canChat: true,
          isConnecting: false,
          isConnected: false,
          isSyncing: false,
          isSynced: false,
        })
      })
  }, [
    initialized,
    isAuthenticated,
    autoConnect,
    chatStatus,
    instance,
    autoSync,
  ])

  useEffect(() => {
    if (
      !initialized ||
      !chatStatus.isConnected ||
      chatStatus.isSynced ||
      hasStartedSynchronization.current
    )
      return
    hasStartedSynchronization.current = true

    if (!autoSync)
      return setChatStatus({
        canChat: true,
        isConnecting: false,
        isConnected: true,
        isSyncing: false,
        isSynced: false,
      })

    instance.chat
      .sync()
      .then(() =>
        setChatStatus({
          canChat: true,
          isConnecting: false,
          isConnected: true,
          isSyncing: false,
          isSynced: true,
        })
      )
      .catch(() => {
        hasStartedSynchronization.current = false
        setChatStatus({
          canChat: true,
          isConnecting: false,
          isConnected: true,
          isSyncing: false,
          isSynced: false,
        })
      })
  }, [initialized, chatStatus, autoSync, instance])

  useEffect(() => {
    if (!initialized) return

    const handleDisconnect = () => {
      hasStartedConnection.current = false
      hasStartedSynchronization.current = false
      setChatStatus({
        canChat: true,
        isConnecting: false,
        isConnected: false,
        isSyncing: false,
        isSynced: false,
      })
    }

    instance.chat.on("disconnect", handleDisconnect)
    return () => instance.chat.off("disconnect", handleDisconnect)
  }, [initialized, instance])

  useEffect(() => {
    if (autoConnect || !autoSync) return

    console.warn(
      "[LoopzProvider]: chatConfig.autoSync has no effect because chatConfig.autoConnect is false"
    )
  }, [autoConnect, autoSync])

  return (
    <LoopzChatContext.Provider
      value={
        {
          ...chatStatus,
          setCanChat,
          setIsConnected,
          setIsSynced,
        } as LoopzChatContextValue
      }
    >
      {children}
    </LoopzChatContext.Provider>
  )
}
