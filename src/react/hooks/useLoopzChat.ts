import { useCallback, useContext } from "react"
import { UseLoopzChat } from "@src/types/react/useloopzchat"
import { LoopzChatContext } from "../context/loopzchatcontext"
import { useLoopz } from "./useLoopz"
import { useLoopzAuth } from "./useLoopzAuth"
import { NotInitializedError } from "@src/errors/NotInitializedError"
import { UnauthenticatedError } from "@src/errors/UnauthenticatedError"
import { NotConnectedError } from "@src/errors/NotConnectedError"

export const useLoopzChat: UseLoopzChat = () => {
  const { initialized, instance } = useLoopz()
  const { isAuthenticated } = useLoopzAuth()
  const context = useContext(LoopzChatContext)
  if (!context)
    throw new Error("useLoopzChat() must be used within a <LoopzProvider />.")

  const { isConnected, setIsConnected } = context

  const connect = useCallback(() => {
    if (!initialized) throw new NotInitializedError()
    if (!isAuthenticated) throw new UnauthenticatedError()

    return !isConnected
      ? instance.chat
          .connect()
          .finally(() => setIsConnected(instance.chat.isConnected()))
      : Promise.resolve()
  }, [initialized, isAuthenticated, isConnected, instance])

  const reconnect = useCallback(() => {
    if (!initialized) throw new NotInitializedError()
    if (!isAuthenticated) throw new UnauthenticatedError()
    if (!isConnected) throw new NotConnectedError()

    return instance.chat.reconnect()
  }, [initialized, isAuthenticated, isConnected, instance])

  const disconnect = useCallback(() => {
    if (!initialized) throw new NotInitializedError()
    if (!isAuthenticated) throw new UnauthenticatedError()
    if (!isConnected) throw new NotConnectedError()

    return instance.chat.disconnect()
  }, [initialized, isAuthenticated, isConnected, instance])

  return {
    initialized,
    isConnected,
    connect,
    reconnect,
    disconnect,
  }
}
