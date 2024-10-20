import { useCallback, useContext } from "react"
import { UseLoopzChat } from "@src/types/react/useloopzchat"
import { LoopzChatContext } from "../context/loopzchatcontext"
import { useLoopz } from "./useLoopz"
import { useLoopzAuth } from "./useLoopzAuth"

export const useLoopzChat: UseLoopzChat = () => {
  const { initialized, instance } = useLoopz()
  const { isAuthenticated } = useLoopzAuth()
  const context = useContext(LoopzChatContext)
  if (!context)
    throw new Error("useLoopzChat() must be used within a <LoopzProvider />.")

  const { isConnected, setIsConnected } = context

  const connect = useCallback(() => {
    if (!initialized || !isAuthenticated || isConnected) return

    return instance.chat
      .connect()
      .finally(() => setIsConnected(instance.chat.isConnected()))
  }, [initialized, isAuthenticated, isConnected, instance])

  const reconnect = useCallback(() => {
    if (!initialized || !isAuthenticated || !isConnected) return

    return instance.chat.reconnect()
  }, [initialized, isAuthenticated, isConnected, instance])

  const disconnect = useCallback(() => {
    if (!initialized || !isAuthenticated || !isConnected) return

    return instance.chat.disconnect()
  }, [initialized, isAuthenticated, isConnected, instance])

  return {
    isConnected,
    connect,
    reconnect,
    disconnect,
  }
}
