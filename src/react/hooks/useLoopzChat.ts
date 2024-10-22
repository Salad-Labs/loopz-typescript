import { useCallback, useContext } from "react"
import { UseLoopzChat } from "../../types/react/useloopzchat"
import { LoopzChatContext } from "../context/loopzchatcontext"
import { NotInitializedError } from "../../errors/NotInitializedError"
import { UnauthenticatedError } from "../../errors/UnauthenticatedError"
import { NotConnectedError } from "../../errors/NotConnectedError"
import { LoopzContext } from "../context/loopzcontext"
import { LoopzAuthContext } from "../context/loopzauthcontext"
import { LoadingError } from "@src/errors/AuthLoadingError"

export const useLoopzChat: UseLoopzChat = () => {
  const loopzContext = useContext(LoopzContext)
  const authContext = useContext(LoopzAuthContext)
  const chatContext = useContext(LoopzChatContext)
  if (!loopzContext || !authContext || !chatContext)
    throw new Error("useLoopzChat() must be used within a <LoopzProvider />.")

  const { initialized, instance } = loopzContext
  const { isAuthenticated } = authContext
  const {
    isConnecting,
    isConnected,
    isSynching,
    isSynched,
    setIsConnected,
    setIsSynched,
  } = chatContext

  const connect = useCallback(() => {
    if (!initialized) throw new NotInitializedError()
    if (!isAuthenticated) throw new UnauthenticatedError()
    if (isConnecting) throw new LoadingError("connect()", "Chat")

    return !isConnected
      ? instance.chat
          .connect()
          .finally(() => setIsConnected(instance.chat.isConnected()))
      : Promise.resolve()
  }, [initialized, isAuthenticated, isConnecting, isConnected, instance])

  const reconnect = useCallback(() => {
    if (!initialized) throw new NotInitializedError()
    if (!isAuthenticated) throw new UnauthenticatedError()
    if (isConnecting) throw new LoadingError("reconnect()", "Chat")
    if (!isConnected) throw new NotConnectedError()

    return instance.chat.reconnect()
  }, [initialized, isAuthenticated, isConnecting, isConnected, instance])

  const disconnect = useCallback(() => {
    if (!initialized) throw new NotInitializedError()
    if (!isAuthenticated) throw new UnauthenticatedError()
    if (isConnecting) throw new LoadingError("disconnect()", "Chat")
    if (!isConnected) throw new NotConnectedError()

    return instance.chat.disconnect()
  }, [initialized, isAuthenticated, isConnecting, isConnected, instance])

  const sync = useCallback(() => {
    if (!initialized) throw new NotInitializedError()
    if (!isAuthenticated) throw new UnauthenticatedError()
    if (isConnecting) throw new LoadingError("sync()", "Chat")
    if (!isConnected) throw new NotConnectedError()
    if (isSynching) throw new LoadingError("sync()", "Chat")

    return !isSynched
      ? instance.chat
          .sync()
          .then(() => setIsSynched(true))
          .catch(() => setIsSynched(false))
      : Promise.resolve()
  }, [
    initialized,
    isAuthenticated,
    isConnecting,
    isConnected,
    isSynching,
    isSynched,
    instance,
  ])

  return {
    isConnecting,
    isConnected,
    isSynching,
    isSynched,
    connect,
    reconnect,
    disconnect,
    sync,
  }
}
