import { useCallback, useContext } from "react"
import { UseLoopzChat } from "../../types/react/useloopzchat"
import { LoopzChatContext } from "../context/loopzchatcontext"
import { NotInitializedError } from "../../errors/NotInitializedError"
import { UnauthenticatedError } from "../../errors/UnauthenticatedError"
import { NotConnectedError } from "../../errors/NotConnectedError"
import { LoopzContext } from "../context/loopzcontext"
import { LoopzAuthProviderContext } from "../context/loopzauthprovidercontext"
import { LoadingError } from "../../errors/AuthLoadingError"
import { ClientCantChatError } from "../../errors/ClientCantChatError"
import { useLoopzChatEvent } from "./useLoopzChatEvent"

export const useLoopzChat: UseLoopzChat = ({
  onSyncing,
  onSync,
  onSyncError,
  onSyncUpdate,
  onMessageCreatedLDB,
  onMessageCreatedLDBError,
  onMessageDeletedLDB,
  onMessageDeletedLDBError,
  onMessageUpdatedLDB,
  onMessageUpdatedLDBError,
  onMessageReceived,
  onMessageReceivedError,
  onMessageUpdated,
  onMessageUpdatedError,
  onMessageDeleted,
  onMessageDeletedError,
  onBatchMessagesDeleted,
  onBatchMessagesDeletedError,
  onConversationCreatedLDB,
  onConversationCreatedLDBError,
  onConversationUpdatedLDB,
  onConversationUpdatedLDBError,
  onConversationCreated,
  onConversationCreatedError,
  onConversationGroupUpdated,
  onConversationGroupUpdatedError,
  onConversationMuted,
  onConversationMutedError,
  onConversationUnmuted,
  onConversationUnmutedError,
  onConversationNewMembers,
  onConversationNewMembersError,
  onMemberEjectedError,
  onMemberLeftError,
  onReactionAdded,
  onReactionAddedError,
  onReactionRemoved,
  onReactionRemovedError,
} = {}) => {
  const loopzContext = useContext(LoopzContext)
  const authContext = useContext(LoopzAuthProviderContext)
  const chatContext = useContext(LoopzChatContext)
  if (!loopzContext || !authContext || !chatContext)
    throw new Error("useLoopzChat() must be used within a <LoopzProvider />.")

  const { initialized, instance } = loopzContext
  const { isAuthenticated } = authContext
  const {
    canChat,
    isConnecting,
    isConnected,
    isSyncing,
    isSynced,
    chatStatusRef,
    setIsConnected,
    setIsSynced,
    setIsSyncing,
    setCanChat,
  } = chatContext

  const connect = useCallback(() => {
    if (!chatStatusRef.current) throw "no chat status reference is defined"
    if (!initialized) throw new NotInitializedError()
    if (!isAuthenticated) throw new UnauthenticatedError()
    if (!chatStatusRef.current.canChat) throw new ClientCantChatError()
    if (chatStatusRef.current.isConnecting)
      throw new LoadingError("connect()", "Chat")

    return !chatStatusRef.current.isConnected
      ? instance.chat
          .connect()
          .finally(() => setIsConnected(instance.chat.isConnected()))
      : Promise.resolve()
  }, [
    initialized,
    isAuthenticated,
    canChat,
    isConnecting,
    isConnected,
    instance,
  ])

  const reconnect = useCallback(() => {
    if (!chatStatusRef.current) throw "no chat status reference is defined"
    if (!initialized) throw new NotInitializedError()
    if (!isAuthenticated) throw new UnauthenticatedError()
    if (!chatStatusRef.current.canChat) throw new ClientCantChatError()
    if (chatStatusRef.current.isConnecting)
      throw new LoadingError("reconnect()", "Chat")
    if (!chatStatusRef.current.isConnected) throw new NotConnectedError()

    return instance.chat.reconnect()
  }, [initialized, instance])

  const disconnect = useCallback(() => {
    if (!chatStatusRef.current) throw "no chat status reference is defined"
    if (!initialized) throw new NotInitializedError()
    if (!isAuthenticated) throw new UnauthenticatedError()
    if (!chatStatusRef.current.canChat) throw new ClientCantChatError()
    if (chatStatusRef.current.isConnecting)
      throw new LoadingError("disconnect()", "Chat")
    if (!chatStatusRef.current.isConnected) throw new NotConnectedError()

    return instance.chat.disconnect()
  }, [initialized, instance])

  const sync = useCallback(async () => {
    if (!chatStatusRef.current) throw "no chat status reference is defined"
    if (!initialized) throw new NotInitializedError()
    if (!chatStatusRef.current.isAuthenticated) throw new UnauthenticatedError()
    if (!chatStatusRef.current.canChat) throw new ClientCantChatError()
    if (chatStatusRef.current.isConnecting)
      throw new LoadingError("sync() - still connecting", "Chat")
    if (!chatStatusRef.current.isConnected) throw new NotConnectedError()
    if (chatStatusRef.current.isSyncing)
      throw new LoadingError("sync() - still syncing", "Chat")

    setIsSyncing(true)

    return
    instance
      .chat!.sync()
      .then(() => {
        setIsSynced(true)
      })
      .catch((error) => {
        setIsSynced(false)
      })
      .finally(() => setIsSyncing(false))
  }, [initialized, instance])

  const unsync = useCallback(() => {
    if (!chatStatusRef.current) throw "no chat status reference is defined"

    if (!initialized) throw new NotInitializedError()
    if (!chatStatusRef.current.isAuthenticated) throw new UnauthenticatedError()
    if (!chatStatusRef.current.canChat) throw new ClientCantChatError()
    if (chatStatusRef.current.isConnecting)
      throw new LoadingError("unsync() - still connecting", "Chat")
    if (!chatStatusRef.current.isConnected) throw new NotConnectedError()
    if (chatStatusRef.current.isSyncing)
      throw new LoadingError("unsync() - still syncing", "Chat")

    return instance
      .chat!.unsync()
      .then(() => {
        setIsSynced(false)
      })
      .catch((error) => {
        setIsSynced(true)
      })
  }, [initialized, instance])

  useLoopzChatEvent("syncing", onSyncing)
  useLoopzChatEvent("sync", onSync)
  useLoopzChatEvent("syncError", onSyncError)
  useLoopzChatEvent("syncUpdate", onSyncUpdate)
  useLoopzChatEvent("messageCreatedLDB", onMessageCreatedLDB)
  useLoopzChatEvent("messageCreatedLDBError", onMessageCreatedLDBError)
  useLoopzChatEvent("messageDeletedLDB", onMessageDeletedLDB)
  useLoopzChatEvent("messageDeletedLDBError", onMessageDeletedLDBError)
  useLoopzChatEvent("messageUpdatedLDB", onMessageUpdatedLDB)
  useLoopzChatEvent("messageUpdatedLDBError", onMessageUpdatedLDBError)
  useLoopzChatEvent("messageReceived", onMessageReceived)
  useLoopzChatEvent("messageReceivedError", onMessageReceivedError)
  useLoopzChatEvent("messageUpdated", onMessageUpdated)
  useLoopzChatEvent("messageUpdatedError", onMessageUpdatedError)
  useLoopzChatEvent("messageDeleted", onMessageDeleted)
  useLoopzChatEvent("messageDeletedError", onMessageDeletedError)
  useLoopzChatEvent("batchMessagesDeleted", onBatchMessagesDeleted)
  useLoopzChatEvent("batchMessagesDeletedError", onBatchMessagesDeletedError)
  useLoopzChatEvent("conversationCreatedLDB", onConversationCreatedLDB)
  useLoopzChatEvent(
    "conversationCreatedLDBError",
    onConversationCreatedLDBError
  )
  useLoopzChatEvent("conversationUpdatedLDB", onConversationUpdatedLDB)
  useLoopzChatEvent(
    "conversationUpdatedLDBError",
    onConversationUpdatedLDBError
  )
  useLoopzChatEvent("conversationGroupUpdated", onConversationGroupUpdated)
  useLoopzChatEvent(
    "conversationGroupUpdatedError",
    onConversationGroupUpdatedError
  )
  useLoopzChatEvent("conversationMuted", onConversationMuted)
  useLoopzChatEvent("conversationMutedError", onConversationMutedError)
  useLoopzChatEvent("conversationUnmuted", onConversationUnmuted)
  useLoopzChatEvent("conversationUnmutedError", onConversationUnmutedError)
  useLoopzChatEvent("conversationCreated", onConversationCreated)
  useLoopzChatEvent("conversationCreatedError", onConversationCreatedError)
  useLoopzChatEvent("conversationNewMembers", onConversationNewMembers)
  useLoopzChatEvent(
    "conversationNewMembersError",
    onConversationNewMembersError
  )
  useLoopzChatEvent("memberEjectedError", onMemberEjectedError)
  useLoopzChatEvent("memberLeftError", onMemberLeftError)
  useLoopzChatEvent("reactionAdded", onReactionAdded)
  useLoopzChatEvent("reactionAddedError", onReactionAddedError)
  useLoopzChatEvent("reactionRemoved", onReactionRemoved)
  useLoopzChatEvent("reactionRemovedError", onReactionRemovedError)

  return {
    canChat,
    isConnecting,
    isConnected,
    isSyncing,
    isSynced,
    chatStatusRef,
    connect,
    reconnect,
    disconnect,
    sync,
    unsync,
    setIsConnected,
    setIsSynced,
    setIsSyncing,
    setCanChat,
  }
}
