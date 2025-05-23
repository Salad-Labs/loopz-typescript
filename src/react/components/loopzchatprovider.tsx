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
> = ({ autoConnect, autoSync, syncingTime, children }) => {
  const { instance, initialized } = useLoopz()
  const { isAuthenticated, account } = useLoopzAuth()

  const hasStartedConnection = useRef(false)
  const hasStartedSynchronization = useRef(false)
  const chatStatusRef = useRef<{
    canChat: boolean
    isConnecting: boolean
    isConnected: boolean
    isSyncing: boolean
    isSynced: boolean
    isAuthenticated: boolean
  }>()

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
    (isSynced: boolean) => setChatStatus((cs) => ({ ...cs, isSynced })),
    []
  )

  const setIsSyncing = useCallback(
    (isSyncing: boolean) => setChatStatus((cs) => ({ ...cs, isSyncing })),
    []
  )

  const setIsConnecting = useCallback(
    (isConnecting: boolean) => setChatStatus((cs) => ({ ...cs, isConnecting })),
    []
  )

  useEffect(() => {
    if (!initialized) return

    setCanChat(instance.chat.clientCanChat())

    instance.chat.on(
      "canChat",
      ({ canChat }: { canChat: boolean }) => {
        setCanChat(canChat) //<- this setCanChat is the function of this hook, it's not the setCanChat of the chat object instance
      },
      true //we prevent more than one adding of the listener
    )

    if (account) {
      account.on(
        "onSignupCompleted",
        () => {
          setCanChat(instance.chat.clientCanChat()) //it should be true since this event is called after the authentication. Authentication on signup turns the value of _canChat to true
        },
        true
      )
    }
  }, [initialized, instance, account])

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
      .catch((error) => {
        console.log(error)
        hasStartedConnection.current = false
        setChatStatus({
          canChat: false,
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
      !account ||
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

    if (account.signupCompleted) {
      if (syncingTime) instance.chat.setSyncingTime(syncingTime)
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
    } else {
      account.on(
        "onSignupCompleted",
        () => {
          if (syncingTime) instance.chat.setSyncingTime(syncingTime)
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
        },
        true
      )
    }
  }, [initialized, chatStatus, autoSync, syncingTime, instance, account])

  useEffect(() => {
    if (!initialized) return

    const handleDisconnect = () => {
      hasStartedConnection.current = false
      hasStartedSynchronization.current = false
      setChatStatus({
        canChat: false,
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

  useEffect(() => {
    chatStatusRef.current = {
      ...chatStatus,
      isAuthenticated,
    }
  }, [chatStatus, isAuthenticated])

  return (
    <LoopzChatContext.Provider
      value={{
        ...chatStatus,
        chatStatusRef,
        setCanChat,
        setIsConnected,
        setIsSynced,
        setIsSyncing,
        setIsConnecting,
      }}
    >
      {children}
    </LoopzChatContext.Provider>
  )
}
